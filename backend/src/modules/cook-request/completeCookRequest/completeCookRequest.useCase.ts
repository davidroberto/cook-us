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

@Injectable()
export class CompleteCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(id: number, currentUserId: number): Promise<CookRequestEntity> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    const client = await this.clientRepository.findOne({
      where: { userId: currentUserId },
    });

    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à compléter cette réservation`
      );
    }

    if (cookRequest.status !== CookRequestStatus.ACCEPTED) {
      throw new BadRequestException(
        `Impossible de compléter une réservation avec le statut "${cookRequest.status}"`
      );
    }

    if (new Date(cookRequest.startDate) > new Date()) {
      throw new BadRequestException(
        `Impossible de compléter une réservation dont la date de prestation n'est pas passée`
      );
    }

    cookRequest.status = CookRequestStatus.COMPLETED;

    return this.cookRequestRepository.save(cookRequest);
  }
}
