import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/modules/conversation/message.entity";

@Injectable()
export class GetUnreadCountsUseCase {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async execute(
    userId: number
  ): Promise<{ conversationId: number; unreadCount: number }[]> {
    const results = await this.messageRepository
      .createQueryBuilder("message")
      .select("message.conversation_id", "conversationId")
      .addSelect("COUNT(*)", "unreadCount")
      .innerJoin(
        "conversation_participant",
        "cp",
        "cp.conversation_id = message.conversation_id AND cp.author_id = :userId AND cp.deleted_at IS NULL",
        { userId }
      )
      .where("message.author_id != :userId", { userId })
      .andWhere("message.read_at IS NULL")
      .groupBy("message.conversation_id")
      .getRawMany<{ conversationId: number; unreadCount: string }>();

    return results.map((r) => ({
      conversationId: Number(r.conversationId),
      unreadCount: Number(r.unreadCount),
    }));
  }
}
