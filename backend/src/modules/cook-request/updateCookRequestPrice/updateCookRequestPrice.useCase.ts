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
import { Message } from "@src/modules/conversation/message.entity";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";

const COOK_ACCEPT_PREFIX = "__COOK_ACCEPT__";

@Injectable()
export class UpdateCookRequestPriceUseCase {
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
        "Vous n'êtes pas autorisé à modifier le prix de cette réservation"
      );
    }

    if (
      cookRequest.status === CookRequestStatus.PAID ||
      cookRequest.status === CookRequestStatus.COMPLETED
    ) {
      throw new BadRequestException(
        "Impossible de modifier le prix d'une réservation déjà payée ou terminée"
      );
    }

    cookRequest.price = price;
    const saved = await this.cookRequestRepository.save(cookRequest);

    if (cookRequest.conversationId) {
      const savedMessage = await this.messageRepository.save(
        this.messageRepository.create({
          authorId: currentUserId,
          conversationId: cookRequest.conversationId,
          message: `${COOK_ACCEPT_PREFIX}${JSON.stringify({
            price,
            cookRequestId: cookRequest.id,
          })}`,
        })
      );

      this.chatGateway.emitToConversation(
        cookRequest.conversationId,
        "newMessage",
        savedMessage
      );
    }

    return saved;
  }
}
