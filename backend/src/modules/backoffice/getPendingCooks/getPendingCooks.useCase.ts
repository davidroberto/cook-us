import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { User } from "@src/modules/user/user.entity";
import { Cook, CookValidationStatus } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetPendingCooksUseCase {
  constructor(
    @InjectRepository(Cook) private readonly cookRepository: Repository<Cook>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async execute() {
    const pendingCooks = await this.cookRepository.find({
      where: { validationStatus: CookValidationStatus.PENDING },
    });

    if (pendingCooks.length === 0) return [];

    const userIds = pendingCooks.map((c) => c.userId);
    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });

    const userById = new Map(users.map((u) => [u.id, u]));

    return pendingCooks.map((cook) => {
      const user = userById.get(cook.userId)!;
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        cookProfile: {
          siret: cook.siret ?? null,
          speciality: cook.speciality,
          validationStatus: cook.validationStatus,
        },
      };
    });
  }
}
