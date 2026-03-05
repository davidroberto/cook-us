import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCookUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(id: string) {
    const cook = await this.cookRepository.findOne({
      where: { id },
      relations: { user: true, images: true, reviews: true },
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
        reviews: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      },
    });

    if (!cook) {
      throw new NotFoundException(`Cook ${id} not found`);
    }

    return cook;
  }
}
