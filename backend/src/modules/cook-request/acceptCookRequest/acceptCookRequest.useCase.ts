import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";
import { User } from "@src/modules/user/user.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { NotificationService } from "@src/modules/notification/notification.service";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";

const COOK_ACCEPT_PREFIX = "__COOK_ACCEPT__";

@Injectable()
export class AcceptCookRequestUseCase {
  private readonly logger = new Logger(AcceptCookRequestUseCase.name);

  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly notificationService: NotificationService,
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

    if (cookRequest.status !== CookRequestStatus.PENDING) {
      throw new BadRequestException(
        `Impossible d'accepter une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.ACCEPTED;
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

    this.sendAcceptedNotification(
      cookRequest.clientId,
      currentUserId,
      cookRequest.conversationId
    ).catch((err) => this.logger.error(`Push notification error: ${err}`));

    return saved;
  }

  private async sendAcceptedNotification(
    clientId: number,
    cookUserId: number,
    conversationId: number | null
  ): Promise<void> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
    });
    if (!client) return;

    const [clientUser, cookUser] = await Promise.all([
      this.userRepository.findOne({ where: { id: client.userId } }),
      this.userRepository.findOne({ where: { id: cookUserId } }),
    ]);

    if (!clientUser?.expoPushToken) return;

    const cookName = cookUser
      ? `${cookUser.firstName} ${cookUser.lastName}`
      : "Le cuisinier";

    await this.notificationService.sendPushNotifications(
      [clientUser.expoPushToken],
      "Réservation acceptée",
      `${cookName} a accepté votre demande de réservation`,
      { conversationId }
    );
  }
}
