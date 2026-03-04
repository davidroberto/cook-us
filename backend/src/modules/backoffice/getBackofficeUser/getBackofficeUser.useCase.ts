import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetBackofficeUserUseCase {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Cook) private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} introuvable.`);
    }

    let cook: Cook | null = null;
    if (user.role === UserRole.COOK) {
      cook = await this.cookRepository.findOne({ where: { userId: id } });
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      thumbnail: user.thumbnail ?? null,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null,
      cookProfile: cook
        ? {
            description: cook.description ?? "",
            speciality: cook.speciality,
            hourlyRate: cook.hourlyRate ?? null,
            city: cook.city ?? "",
          }
        : null,
    };
  }
}
