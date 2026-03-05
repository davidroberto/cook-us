import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCookProfileUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(userId: number) {
    const cook = await this.cookRepository.findOne({ where: { userId } });
    if (!cook) {
      throw new NotFoundException("Profil cuisinier introuvable.");
    }

    return {
      description: cook.description,
      speciality: cook.speciality,
      hourlyRate: cook.hourlyRate,
      city: cook.city,
      photoUrl: cook.photoUrl,
    };
  }
}
