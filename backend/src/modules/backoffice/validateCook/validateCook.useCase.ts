import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook, CookValidationStatus } from "@src/modules/cook/cook.entity";
import { User, UserRole } from "@src/modules/user/user.entity";

@Injectable()
export class ValidateCookUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async execute(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`Utilisateur #${userId} introuvable`);
    }

    if (user.role !== UserRole.COOK) {
      throw new BadRequestException(
        "L'utilisateur cible n'est pas un cuisinier"
      );
    }

    const cook = await this.cookRepository.findOne({ where: { userId } });

    if (!cook) {
      throw new NotFoundException(`Profil cuisinier introuvable`);
    }

    cook.isValidated = true;
    cook.validationStatus = CookValidationStatus.VALIDATED;
    return this.cookRepository.save(cook);
  }
}
