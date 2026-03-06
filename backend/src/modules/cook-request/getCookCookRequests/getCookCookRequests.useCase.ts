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
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(userId: number, page = 1, limit = 20) {
    const cook = await this.cookRepository.findOne({ where: { userId } });

    if (!cook) {
      throw new NotFoundException("Cuisinier introuvable");
    }

    const [requests, total] = await this.cookRequestRepository.findAndCount({
      where: { cookId: cook.id },
      relations: { client: { user: true } },
      order: { startDate: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = requests.map((r) => ({
      id: r.id,
      guestsNumber: r.guestsNumber,
      startDate: r.startDate,
      endDate: r.endDate ?? null,
      status: r.status,
      cancellationReason: r.cancellationReason,
      street: r.street ?? null,
      postalCode: r.postalCode ?? null,
      city: r.city ?? null,
      client: {
        id: r.client.userId,
        firstName: r.client.user.firstName,
        lastName: r.client.user.lastName,
      },
    }));

    return { data, total, hasMore: page * limit < total };
  }
}
