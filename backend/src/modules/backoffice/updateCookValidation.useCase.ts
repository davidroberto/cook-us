import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook, CookValidationStatus } from "@src/modules/cook/cook.entity";

@Injectable()
export class UpdateCookValidationUseCase {
  constructor(
    @InjectRepository(Cook) private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(cookId: string, approve: boolean) {
    const cook = await this.cookRepository.findOne({ where: { id: cookId } });
    if (!cook) throw new NotFoundException("Cuisinier introuvable");
    cook.isValidated = approve;
    cook.validationStatus = approve
      ? CookValidationStatus.VALIDATED
      : CookValidationStatus.REFUSED;
    return this.cookRepository.save(cook);
  }
}
