import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { Message } from "@src/modules/conversation/message.entity";

@Injectable()
export class GetMyConversationsUseCase {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async execute(userId: number) {
    const conversations = await this.conversationRepository
      .createQueryBuilder("conversation")
      .leftJoinAndSelect("conversation.participants", "participant")
      .leftJoinAndSelect("participant.author", "author")
      .leftJoinAndSelect("conversation.messages", "message")
      .leftJoinAndSelect("message.author", "messageAuthor")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("cp.conversation_id")
          .from("conversation_participant", "cp")
          .where("cp.author_id = :userId")
          .andWhere("cp.deleted_at IS NULL")
          .getQuery();
        return "conversation.id IN " + subQuery;
      })
      .setParameters({ userId })
      .getMany();

    const conversationIds = conversations.map((c) => c.id);

    if (conversationIds.length === 0) {
      return [];
    }

    const unreadCounts = await this.messageRepository
      .createQueryBuilder("message")
      .select("message.conversation_id", "conversationId")
      .addSelect("COUNT(*)", "unreadCount")
      .where("message.conversation_id IN (:...conversationIds)", {
        conversationIds,
      })
      .andWhere("message.author_id != :userId", { userId })
      .andWhere("message.read_at IS NULL")
      .groupBy("message.conversation_id")
      .getRawMany<{ conversationId: number; unreadCount: string }>();

    const unreadMap = new Map<number, number>();
    for (const row of unreadCounts) {
      unreadMap.set(Number(row.conversationId), Number(row.unreadCount));
    }

    return conversations.map((conversation) => ({
      ...conversation,
      unreadCount: unreadMap.get(conversation.id) ?? 0,
    }));
  }
}
