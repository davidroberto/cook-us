import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { Client } from "@src/modules/client/client.entity";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCookRequestsByConversationUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(conversationId: number, currentUserId: number) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: { participants: true },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation introuvable");
    }

    const participantIds = conversation.participants
      .filter((p) => !p.deletedAt)
      .map((p) => p.authorId);

    if (!participantIds.includes(currentUserId)) {
      throw new ForbiddenException(
        "Vous n'êtes pas participant de cette conversation."
      );
    }

    const clients = await this.clientRepository.find({
      where: participantIds.map((id) => ({ userId: id })),
    });
    const cooks = await this.cookRepository.find({
      where: participantIds.map((id) => ({ userId: id })),
    });

    if (!clients.length || !cooks.length) {
      return [];
    }

    const client = clients[0];
    const cook = cooks[0];

    const requests = await this.cookRequestRepository.find({
      where: { cookId: cook.id, clientId: client.id },
      order: { startDate: "DESC" },
    });

    return requests.map((r) => ({
      id: r.id,
      startDate: r.startDate,
      endDate: r.endDate ?? null,
      guestsNumber: r.guestsNumber,
      mealType: r.mealType,
      status: r.status,
    }));
  }
}
