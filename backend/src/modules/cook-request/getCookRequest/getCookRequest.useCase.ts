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
      relations: { cook: true, client: true },
    });

    if (!cookRequest) {
      throw new NotFoundException(`Cook request ${id} not found`);
    }

    return cookRequest;
  }
}
