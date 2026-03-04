import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetBackofficeUsersUseCase {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Cook) private readonly cookRepository: Repository<Cook>
  ) {}

  async createAdmin(dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException("Un compte avec cet email existe déjà.");
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    await this.userRepository.save(user);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async execute() {
    const users = await this.userRepository.find({ withDeleted: true });

    const cookUserIds = users
      .filter((u) => u.role === UserRole.COOK)
      .map((u) => u.id);

    const cooks =
      cookUserIds.length > 0
        ? await this.cookRepository.find({
            where: { userId: In(cookUserIds) },
          })
        : [];

    const cookByUserId = new Map(cooks.map((c) => [c.userId, c]));

    return users.map((user) => {
      const cook = cookByUserId.get(user.id) ?? null;
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
              siret: cook.siret ?? null,
            }
          : null,
      };
    });
  }
}
