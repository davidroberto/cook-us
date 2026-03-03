import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { CreateConversationDto } from "@src/modules/conversation/createConversation/createConversation.dto";

@Injectable()
export class CreateConversationUseCase {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
  ) {}

  async execute(dto: CreateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationRepository.save(
      this.conversationRepository.create(),
    );

    const participants = dto.participantIds.map((userId) =>
      this.participantRepository.create({
        authorId: userId,
        conversationId: conversation.id,
      }),
    );

    await this.participantRepository.save(participants);

    return this.conversationRepository.findOne({
      where: { id: conversation.id },
      relations: { participants: { author: true }, messages: true },
    });
  }
}
