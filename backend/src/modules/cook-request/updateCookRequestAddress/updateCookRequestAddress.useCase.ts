import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { Repository } from "typeorm";
import { UpdateCookRequestAddressDto } from "./updateCookRequestAddress.dto";

const NON_EDITABLE_STATUSES = [
  CookRequestStatus.PAID,
  CookRequestStatus.COMPLETED,
];

@Injectable()
export class UpdateCookRequestAddressUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(id: number, dto: UpdateCookRequestAddressDto, userId: number) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
    });
    if (!cookRequest) {
      throw new NotFoundException("Demande introuvable.");
    }

    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier cette demande."
      );
    }

    if (NON_EDITABLE_STATUSES.includes(cookRequest.status)) {
      throw new BadRequestException(
        "L'adresse ne peut pas être modifiée une fois la prestation payée ou terminée."
      );
    }

    cookRequest.street = dto.street;
    cookRequest.postalCode = dto.postalCode;
    cookRequest.city = dto.city;

    await this.cookRequestRepository.save(cookRequest);

    return {
      id: cookRequest.id,
      street: cookRequest.street,
      postalCode: cookRequest.postalCode,
      city: cookRequest.city,
    };
  }
}
