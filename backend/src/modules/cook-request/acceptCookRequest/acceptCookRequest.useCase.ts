import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";
import { Message } from "@src/modules/conversation/message.entity";

const COMMISSION_RATE = 0.1;

@Injectable()
export class AcceptCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly chatGateway: ChatGateway
  ) {}

  async execute(
    id: number,
    currentUserId: number,
    price: number
  ): Promise<CookRequestEntity> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: ["cook"],
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    if (cookRequest.cook.userId !== currentUserId) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à accepter cette réservation`
      );
    }

    if (
      cookRequest.status !== CookRequestStatus.PENDING &&
      cookRequest.status !== CookRequestStatus.ACCEPTED
    ) {
      throw new BadRequestException(
        `Impossible d'accepter une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.ACCEPTED;
    cookRequest.price = price;
    cookRequest.totalPrice =
      Math.round(price * (1 + COMMISSION_RATE) * 100) / 100;

    const saved = await this.cookRequestRepository.save(cookRequest);

    if (saved.conversationId) {
      const message = await this.messageRepository.save(
        this.messageRepository.create({
          authorId: currentUserId,
          conversationId: saved.conversationId,
          message: `J'ai accepté votre demande de prestation. Montant à régler : ${saved.totalPrice} € (dont ${price} € de prestation + commission de l'application).`,
        })
      );

      this.chatGateway.emitToConversation(
        saved.conversationId,
        "newMessage",
        message
      );

      this.chatGateway.emitToConversation(
        saved.conversationId,
        "cookRequestAccepted",
        { cookRequestId: saved.id, conversationId: saved.conversationId }
      );
    }

    return saved;
  }
}
