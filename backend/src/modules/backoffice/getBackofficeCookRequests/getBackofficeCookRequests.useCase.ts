import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@Injectable()
export class GetBackofficeCookRequestsUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute() {
    const requests = await this.cookRequestRepository.find({
      relations: { cook: true, client: { user: true } },
    });

    return requests.map((r) => ({
      id: r.id,
      status: r.status,
      guestsNumber: r.guestsNumber,
      startDate: r.startDate.toISOString(),
      endDate: r.endDate?.toISOString() ?? null,
      cook: {
        id: r.cook.userId,
        firstName: r.cook.firstName,
        lastName: r.cook.lastName,
      },
      client: {
        id: r.client.userId,
        firstName: r.client.user.firstName,
        lastName: r.client.user.lastName,
      },
    }));
  }
}
