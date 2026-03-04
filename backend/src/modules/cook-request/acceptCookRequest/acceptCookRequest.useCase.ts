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

@Injectable()
export class AcceptCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute(id: number, currentUserId: number): Promise<CookRequestEntity> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: ["cook"],
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    if (cookRequest.cook.userId !== currentUserId) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à accepter cette réservation`
      );
    }

    if (cookRequest.status !== CookRequestStatus.PENDING) {
      throw new BadRequestException(
        `Impossible d'accepter une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.ACCEPTED;

    return this.cookRequestRepository.save(cookRequest);
  }
}
