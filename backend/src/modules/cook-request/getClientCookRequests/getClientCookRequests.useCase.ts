import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Review } from "@src/modules/cook-request/review.entity";
import { Client } from "@src/modules/client/client.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";

@Injectable()
export class GetClientCookRequestsUseCase {
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
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  async execute(userId: number): Promise<CookRequestEntity[]> {
    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    const requests = await this.cookRequestRepository.find({
      where: { clientId: client.id },
      relations: { cook: true },
      order: { startDate: "DESC" },
    });

    const reviews = await this.reviewRepository.find({
      where: { clientId: client.id },
    });

    const reviewByCookRequestId = new Map(
      reviews.map((r) => [r.cookRequestId, r])
    );

    return requests.map((r) => ({
      ...r,
      review: reviewByCookRequestId.get(r.id) ?? null,
    }));
  }

  async executeByConversation(conversationId: number, currentUserId: number) {
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

    const requests = await this.cookRequestRepository.find({
      where: { cookId: cooks[0].id, clientId: clients[0].id },
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
