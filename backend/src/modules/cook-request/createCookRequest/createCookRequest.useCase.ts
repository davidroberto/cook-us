import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
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
import { User } from "@src/modules/user/user.entity";
import { CookUnavailability } from "@src/modules/cook/cookUnavailability.entity";
import { NotificationService } from "@src/modules/notification/notification.service";
import { In, Repository } from "typeorm";

@Injectable()
export class CreateCookRequestUseCase {
  private readonly logger = new Logger(CreateCookRequestUseCase.name);

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CookUnavailability)
    private readonly unavailabilityRepository: Repository<CookUnavailability>,
    private readonly notificationService: NotificationService
  ) {}

  async execute(dto: CreateCookRequestDto, userId: number) {
    const start = new Date(dto.startDate);
    if (start <= new Date()) {
      throw new BadRequestException(
        "La date de début doit être dans le futur."
      );
    }
    if (dto.endDate && new Date(dto.endDate) <= start) {
      throw new BadRequestException(
        "La date de fin doit être postérieure à la date de début."
      );
    }

    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client) throw new NotFoundException("Client introuvable");

    const street = dto.street?.trim() || client.street || null;
    const postalCode = dto.postalCode?.trim() || client.postalCode || null;
    const city = dto.city?.trim() || client.city || null;

    const cook = await this.cookRepository.findOne({
      where: { id: dto.cookId },
    });
    if (!cook) throw new NotFoundException("Cuisinier introuvable");

    const dateStr = start.toISOString().slice(0, 10);
    const unavailability = await this.unavailabilityRepository.findOne({
      where: { cookId: dto.cookId, date: dateStr },
    });
    if (unavailability) {
      throw new BadRequestException(
        "Ce cuisinier n'est pas disponible à cette date."
      );
    }

    const clientParticipations = await this.participantRepository.find({
      where: { authorId: client.userId },
      select: { conversationId: true },
    });

    let existingConversation: Conversation | null = null;
    if (clientParticipations.length > 0) {
      const sharedParticipation = await this.participantRepository.findOne({
        where: {
          authorId: cook.userId,
          conversationId: In(clientParticipations.map((p) => p.conversationId)),
        },
      });
      if (sharedParticipation) {
        existingConversation = await this.conversationRepository.findOne({
          where: { id: sharedParticipation.conversationId },
        });
      }
    }

    const conversation =
      existingConversation ??
      (await this.conversationRepository.save(
        this.conversationRepository.create()
      ));

    if (!existingConversation) {
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
    }

    const cookRequest = this.cookRequestRepository.create({
      guestsNumber: dto.guestsNumber,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      cookId: dto.cookId,
      clientId: client.id,
      status: CookRequestStatus.PENDING,
      mealType: dto.mealType,
      message: dto.message ?? null,
      conversationId: conversation.id,
      street,
      postalCode,
      city,
    });
    const saved = await this.cookRequestRepository.save(cookRequest);

    this.sendNewRequestNotification(cook.userId, userId, conversation.id).catch(
      (err) => this.logger.error(`Push notification error: ${err}`)
    );

    return {
      id: saved.id,
      guestsNumber: saved.guestsNumber,
      startDate: saved.startDate,
      endDate: saved.endDate ?? null,
      status: saved.status,
      mealType: saved.mealType,
      message: saved.message,
      cookId: saved.cookId,
      clientId: saved.clientId,
      conversationId: conversation.id,
    };
  }

  private async sendNewRequestNotification(
    cookUserId: number,
    clientUserId: number,
    conversationId: number
  ): Promise<void> {
    const [cookUser, clientUser] = await Promise.all([
      this.userRepository.findOne({ where: { id: cookUserId } }),
      this.userRepository.findOne({ where: { id: clientUserId } }),
    ]);

    if (!cookUser?.expoPushToken) return;

    const clientName = clientUser
      ? `${clientUser.firstName} ${clientUser.lastName}`
      : "Un client";

    await this.notificationService.sendPushNotifications(
      [cookUser.expoPushToken],
      "Nouvelle demande de réservation",
      `${clientName} vous a envoyé une demande de réservation`,
      { conversationId }
    );
  }
}
