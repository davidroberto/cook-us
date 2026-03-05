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
import { ChatGateway } from "@src/modules/conversation/chat.gateway";

@Injectable()
export class MarkMessagesAsReadUseCase {
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
    userId: number
  ): Promise<{ markedCount: number }> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const result = await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ readAt: () => "NOW()" })
      .where("conversation_id = :conversationId", { conversationId })
      .andWhere("author_id != :userId", { userId })
      .andWhere("read_at IS NULL")
      .execute();

    const markedCount = result.affected ?? 0;

    if (markedCount > 0) {
      this.chatGateway.emitToConversation(conversationId, "messagesRead", {
        conversationId,
        readByUserId: userId,
        readAt: new Date().toISOString(),
        markedCount,
      });
    }

    return { markedCount };
  }
}
