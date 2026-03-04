import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { Repository } from "typeorm";

@Injectable()
export class CreateCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>
  ) {}

  async execute(dto: CreateCookRequestDto, userId: number) {
    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client) throw new NotFoundException("Client introuvable");

    const cook = await this.cookRepository.findOne({
      where: { id: dto.cookId },
    });
    if (!cook) throw new NotFoundException("Cuisinier introuvable");

    const cookRequest = this.cookRequestRepository.create({
      guestsNumber: dto.guestsNumber,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      cookId: dto.cookId,
      clientId: client.id,
      status: CookRequestStatus.PENDING,
    });
    const saved = await this.cookRequestRepository.save(cookRequest);

    const conversation = await this.conversationRepository.save(
      this.conversationRepository.create()
    );
    await this.participantRepository.save([
      this.participantRepository.create({
        authorId: client.userId,
        conversationId: conversation.id,
      }),
      this.participantRepository.create({
        authorId: cook.userId,
        conversationId: conversation.id,
      }),
    ]);

    return {
      id: saved.id,
      guestsNumber: saved.guestsNumber,
      startDate: saved.startDate,
      endDate: saved.endDate ?? null,
      status: saved.status,
      cookId: saved.cookId,
      clientId: saved.clientId,
      conversationId: conversation.id,
    };
  }
}
