import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";

@Injectable()
export class CreateCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
  ) {}

  async execute(dto: CreateCookRequestDto): Promise<CookRequestEntity> {
    const cookRequest = this.cookRequestRepository.create({
      guestsNumber: dto.guestsNumber,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      cookId: dto.cookId,
      clientId: dto.clientId,
    });

    return this.cookRequestRepository.save(cookRequest);
  }
}
