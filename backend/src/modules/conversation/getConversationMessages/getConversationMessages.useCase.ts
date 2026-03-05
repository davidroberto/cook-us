import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/modules/conversation/message.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";

@Injectable()
export class GetConversationMessagesUseCase {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>
  ) {}

  async execute(conversationId: number, page = 1, limit = 20) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { conversationId },
      relations: { author: true },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      messages,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }
}
