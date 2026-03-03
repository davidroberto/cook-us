import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@Injectable()
export class GetCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute(id: number) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
      relations: { cook: true, client: { user: true } },
    });

    if (!cookRequest) {
      throw new NotFoundException(`Cook request ${id} not found`);
    }

    return {
      id: cookRequest.id,
      guestsNumber: cookRequest.guestsNumber,
      startDate: cookRequest.startDate,
      endDate: cookRequest.endDate ?? null,
      status: cookRequest.status,
      cook: {
        id: cookRequest.cook.id,
        firstName: cookRequest.cook.firstName,
        lastName: cookRequest.cook.lastName,
        speciality: cookRequest.cook.speciality,
      },
      client: {
        id: cookRequest.client.userId,
        firstName: cookRequest.client.user.firstName,
        lastName: cookRequest.client.user.lastName,
      },
    };
  }
}
