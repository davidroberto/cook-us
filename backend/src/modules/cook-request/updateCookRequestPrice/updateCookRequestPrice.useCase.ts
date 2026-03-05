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

const COMMISSION_RATE = 0.1;

@Injectable()
export class UpdateCookRequestPriceUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute(
    id: number,
    currentUserId: number,
    price: number
  ): Promise<CookRequestEntity> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: ["cook"],
    });

    if (!cookRequest) {
      throw new NotFoundException(`La réservation #${id} n'existe pas`);
    }

    if (cookRequest.cook.userId !== currentUserId) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à modifier le prix de cette réservation`
      );
    }

    if (cookRequest.status === CookRequestStatus.PAID) {
      throw new BadRequestException(
        `Impossible de modifier le prix d'une réservation déjà payée`
      );
    }

    cookRequest.price = price;
    cookRequest.totalPrice =
      Math.round(price * (1 + COMMISSION_RATE) * 100) / 100;

    return this.cookRequestRepository.save(cookRequest);
  }
}
