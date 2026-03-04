import {
  Injectable,
  Inject,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/modules/conversation/message.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { SendMessageDto } from "@src/modules/conversation/sendMessage/sendMessage.dto";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";

@Injectable()
export class SendMessageUseCase {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway
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
      message: dto.message,
    });

    const savedMessage = await this.messageRepository.save(message);

    this.chatGateway.emitToConversation(
      conversationId,
      "newMessage",
      savedMessage
    );

    return savedMessage;
  }
}
