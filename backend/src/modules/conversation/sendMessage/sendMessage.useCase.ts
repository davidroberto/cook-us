import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/modules/conversation/message.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { User } from "@src/modules/user/user.entity";
import { SendMessageDto } from "@src/modules/conversation/sendMessage/sendMessage.dto";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";
import { NotificationService } from "@src/modules/notification/notification.service";

@Injectable()
export class SendMessageUseCase {
  private readonly logger = new Logger(SendMessageUseCase.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway,
    private readonly notificationService: NotificationService
  ) {}

  async execute(
    conversationId: number,
    authorId: number,
    dto: SendMessageDto
  ): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const message = this.messageRepository.create({
      authorId,
      conversationId,
      message: dto.message ?? "",
      imageUrl: dto.imageUrl ?? null,
    });

    const savedMessage = await this.messageRepository.save(message);

    this.chatGateway.emitToConversation(
      conversationId,
      "newMessage",
      savedMessage
    );

    this.sendPushNotifications(
      conversationId,
      authorId,
      dto.message ?? "",
      dto.imageUrl ?? null
    ).catch((err) => this.logger.error(`Push notification error: ${err}`));

    return savedMessage;
  }

  private async sendPushNotifications(
    conversationId: number,
    authorId: number,
    messageContent: string,
    imageUrl: string | null
  ): Promise<void> {
    const participants = await this.participantRepository.find({
      where: { conversationId },
    });

    const recipientIds = participants
      .filter((p) => p.authorId !== authorId)
      .map((p) => p.authorId);

    if (recipientIds.length === 0) return;

    const [author, recipients] = await Promise.all([
      this.userRepository.findOne({ where: { id: authorId } }),
      this.userRepository.find({ where: recipientIds.map((id) => ({ id })) }),
    ]);

    const pushTokens = recipients
      .map((u) => u.expoPushToken)
      .filter((t): t is string => !!t);

    if (pushTokens.length === 0) return;

    const title = author
      ? `${author.firstName} ${author.lastName}`
      : "Nouveau message";

    const rawBody = messageContent || (imageUrl ? "Image" : "");
    const body = rawBody.length > 100 ? rawBody.slice(0, 100) + "..." : rawBody;

    await this.notificationService.sendPushNotifications(
      pushTokens,
      title,
      body,
      {
        conversationId,
      }
    );
  }
}
