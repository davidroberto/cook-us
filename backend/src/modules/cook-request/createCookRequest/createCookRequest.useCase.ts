import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";
import { Repository } from "typeorm";

@Injectable()
export class CreateCookRequestUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async execute(dto: CreateCookRequestDto, userId: number) {
    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    const cookRequest = this.cookRequestRepository.create({
      guestsNumber: dto.guestsNumber,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      cookId: dto.cookId,
      clientId: client.id,
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
