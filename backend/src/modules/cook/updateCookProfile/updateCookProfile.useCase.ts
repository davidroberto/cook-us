import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { UpdateCookProfileDto } from "@src/modules/cook/updateCookProfile/updateCookProfile.dto";

@Injectable()
export class UpdateCookProfileUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(userId: number, dto: UpdateCookProfileDto) {
    const cook = await this.cookRepository.findOne({ where: { userId } });
    if (!cook) {
      throw new NotFoundException("Profil cuisinier introuvable.");
    }

    if (dto.description !== undefined) cook.description = dto.description;
    if (dto.speciality !== undefined) cook.speciality = dto.speciality;
    if (dto.hourlyRate !== undefined) cook.hourlyRate = dto.hourlyRate;
    if (dto.city !== undefined) cook.city = dto.city;
    if (dto.photoUrl !== undefined) cook.photoUrl = dto.photoUrl;

    await this.cookRepository.save(cook);

    return {
      description: cook.description,
      speciality: cook.speciality,
      hourlyRate: cook.hourlyRate,
      city: cook.city,
      photoUrl: cook.photoUrl,
    };
  }
}
