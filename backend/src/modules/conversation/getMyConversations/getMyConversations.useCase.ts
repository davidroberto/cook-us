import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";

@Injectable()
export class GetMyConversationsUseCase {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async execute(userId: number): Promise<Conversation[]> {
    return this.conversationRepository
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
  }
}
