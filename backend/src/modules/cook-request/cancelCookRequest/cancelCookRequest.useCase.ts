import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { CancelCookRequestDto } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.dto";

@Injectable()
export class CancelCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute(
    id: number,
    dto: CancelCookRequestDto
  ): Promise<CookRequestEntity> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    if (
      cookRequest.status !== CookRequestStatus.PENDING &&
      cookRequest.status !== CookRequestStatus.ACCEPTED
    ) {
      throw new BadRequestException(
        `Impossible d'annuler une réservation avec le statut "${cookRequest.status}"`
      );
    }

    cookRequest.status = CookRequestStatus.CANCELLED;
    cookRequest.cancellationReason = dto.reason;

    return this.cookRequestRepository.save(cookRequest);
  }
}
