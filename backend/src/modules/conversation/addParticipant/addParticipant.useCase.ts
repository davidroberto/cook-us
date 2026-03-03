import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { AddParticipantDto } from "@src/modules/conversation/addParticipant/addParticipant.dto";

@Injectable()
export class AddParticipantUseCase {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async execute(
    conversationId: number,
    dto: AddParticipantDto,
  ): Promise<ConversationParticipant> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation ${conversationId} not found`);
    }

    const existing = await this.participantRepository.findOne({
      where: { conversationId, authorId: dto.userId },
    });

    if (existing) {
      throw new BadRequestException(
        `L'utilisateur ${dto.userId} est déjà participant de cette conversation`,
      );
    }

    const participant = this.participantRepository.create({
      authorId: dto.userId,
      conversationId,
    });

    return this.participantRepository.save(participant);
  }
}
