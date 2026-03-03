import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCooksUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  execute() {
    return this.cookRepository.find({
      relations: { user: true, images: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        description: true,
        speciality: true,
        hourlyRate: true,
        isActive: true,
        isValidated: true,
        city: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          thumbnail: true,
          role: true,
        },
        images: {
          id: true,
          imgUrl: true,
          description: true,
        },
      },
    });
  }
}
