import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";

@Injectable()
export class RemoveParticipantUseCase {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>
  ) {}

  async execute(conversationId: number, userId: number): Promise<void> {
    const participant = await this.participantRepository.findOne({
      where: { conversationId, authorId: userId },
    });

    if (!participant) {
      throw new NotFoundException(
        `Participant with userId ${userId} not found in conversation ${conversationId}`
      );
    }

    await this.participantRepository.softRemove(participant);
  }
}
