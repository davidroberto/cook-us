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
import { UserRole } from "@src/modules/user/user.entity";

const PLATFORM_COMMISSION_RATE = 0.3;

@Injectable()
export class GetCookRequestPriceUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(id: number, currentUser: { id: number; role: UserRole }) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: { cook: true, client: true },
    });

    if (!cookRequest) {
      throw new NotFoundException(`Cook request ${id} not found`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      const client = await this.clientRepository.findOne({
        where: { userId: currentUser.id },
      });

      if (!client || cookRequest.clientId !== client.id) {
        throw new ForbiddenException(
          "Vous n'êtes pas autorisé à consulter cette réservation."
        );
      }
    }

    if (currentUser.role === UserRole.COOK) {
      if (cookRequest.cook.userId !== currentUser.id) {
        throw new ForbiddenException(
          "Vous n'êtes pas autorisé à consulter cette réservation."
        );
      }
    }

    if (cookRequest.status !== CookRequestStatus.ACCEPTED) {
      throw new BadRequestException(
        "Le détail du prix n'est disponible que pour les réservations acceptées."
      );
    }

    if (!cookRequest.price) {
      throw new BadRequestException(
        "Le prix n'a pas encore été défini pour cette réservation."
      );
    }

    const subtotal = Number(cookRequest.price);
    const commission = subtotal * PLATFORM_COMMISSION_RATE;
    const total = subtotal + commission;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      commissionRate: PLATFORM_COMMISSION_RATE,
      commission: Math.round(commission * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
}
