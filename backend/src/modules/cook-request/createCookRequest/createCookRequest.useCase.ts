import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";

@Injectable()
export class CreateCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>
  ) {}

  async execute(dto: CreateCookRequestDto) {
    const cookRequest = this.cookRequestRepository.create({
      guestsNumber: dto.guestsNumber,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      cookId: dto.cookId,
      clientId: dto.clientId,
      status: CookRequestStatus.PENDING,
    });

    const saved = await this.cookRequestRepository.save(cookRequest);

    return {
      id: saved.id,
      guestsNumber: saved.guestsNumber,
      startDate: saved.startDate,
      endDate: saved.endDate ?? null,
      status: saved.status,
      cookId: saved.cookId,
      clientId: saved.clientId,
    };
  }
}
