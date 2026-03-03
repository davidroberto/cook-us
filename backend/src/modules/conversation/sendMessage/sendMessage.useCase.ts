import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "@src/modules/conversation/message.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { SendMessageDto } from "@src/modules/conversation/sendMessage/sendMessage.dto";

@Injectable()
export class SendMessageUseCase {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async execute(
    conversationId: number,
    authorId: number,
    dto: SendMessageDto,
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

    return this.messageRepository.save(message);
  }
}
