import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetCookCookRequestsUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
  ) {}

  async execute(userId: number) {
    const cook = await this.cookRepository.findOne({ where: { userId } });

    if (!cook) {
      throw new NotFoundException("Cuisinier introuvable");
    }

    const requests = await this.cookRequestRepository.find({
      where: { cookId: cook.id },
      relations: { client: { user: true } },
      order: { startDate: "DESC" },
    });

    return requests.map((r) => ({
      id: r.id,
      guestsNumber: r.guestsNumber,
      startDate: r.startDate,
      endDate: r.endDate ?? null,
      status: r.status,
      cancellationReason: r.cancellationReason,
      client: {
        id: r.client.userId,
        firstName: r.client.user.firstName,
        lastName: r.client.user.lastName,
      },
    }));
  }
}
