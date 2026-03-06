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
import { Client } from "@src/modules/client/client.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { User } from "@src/modules/user/user.entity";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";

const COOK_PAID_PREFIX = "__COOK_PAID__";
const PLATFORM_COMMISSION_RATE = 0.3;

@Injectable()
export class PayCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly chatGateway: ChatGateway
  ) {}

  async execute(id: number, userId: number) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: ["client"],
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à payer cette réservation"
      );
    }

    if (cookRequest.status !== CookRequestStatus.ACCEPTED) {
      throw new BadRequestException(
        `Impossible de payer une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.PAID;
    const saved = await this.cookRequestRepository.save(cookRequest);

    if (cookRequest.conversationId) {
      const subtotal = Number(cookRequest.price ?? 0);
      const total =
        Math.round(subtotal * (1 + PLATFORM_COMMISSION_RATE) * 100) / 100;

      const savedMessage = await this.messageRepository.save(
        this.messageRepository.create({
          authorId: userId,
          conversationId: cookRequest.conversationId,
          message: `${COOK_PAID_PREFIX}${JSON.stringify({
            cookRequestId: cookRequest.id,
            total,
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
