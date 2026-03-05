import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";

@Injectable()
export class GetClientTransactionsUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(userId: number) {
    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    const transactions = await this.cookRequestRepository.find({
      where: { clientId: client.id, status: CookRequestStatus.PAID },
      relations: { cook: true },
      order: { startDate: "DESC" },
    });

    return transactions.map((t) => ({
      id: t.id,
      startDate: t.startDate,
      endDate: t.endDate,
      guestsNumber: t.guestsNumber,
      mealType: t.mealType,
      totalPaid: t.totalPaid,
      cook: {
        id: t.cook.id,
        firstName: t.cook.firstName,
        lastName: t.cook.lastName,
        speciality: t.cook.speciality,
      },
    }));
  }
}
