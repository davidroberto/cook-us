import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";

@Injectable()
export class GetClientCookRequestsUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(userId: number): Promise<CookRequestEntity[]> {
    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      throw new NotFoundException("Client introuvable");
    }

    return this.cookRequestRepository.find({
      where: { clientId: client.id },
      relations: { cook: true },
      order: { startDate: "DESC" },
    });
  }
}
