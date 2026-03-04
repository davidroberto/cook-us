import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@src/modules/user/user.entity";

@Injectable()
export class CreateAdminUserUseCase {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async execute(dto: {
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
}
