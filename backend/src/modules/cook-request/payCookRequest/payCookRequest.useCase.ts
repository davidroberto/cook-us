import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { User } from "@src/modules/user/user.entity";

@Injectable()
export class PayCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async execute(id: number, userId: number) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: ["client", "cook"],
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à payer cette réservation"
      );
    }

    if (cookRequest.status !== CookRequestStatus.ACCEPTED) {
      throw new BadRequestException(
        `Impossible de payer une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.PAID;

    if (cookRequest.endDate && cookRequest.cook?.hourlyRate != null) {
      const hourlyRate = Number(cookRequest.cook.hourlyRate);
      const durationMs = cookRequest.endDate.getTime() - cookRequest.startDate.getTime();
      const hours = durationMs / (1000 * 60 * 60);
      const subtotal = hourlyRate * hours;
      const total = subtotal * 1.15;
      cookRequest.totalPaid = Math.round(total * 100) / 100;
    }

    const saved = await this.cookRequestRepository.save(cookRequest);

    if (cookRequest.conversationId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        await this.messageRepository.save(
          this.messageRepository.create({
            authorId: userId,
            conversationId: cookRequest.conversationId,
            message: `La prestation a été réglée par ${user.firstName} ${user.lastName}.`,
          })
        );
      }
    }

    return saved;
  }
}
