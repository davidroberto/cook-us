import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { RegisterDto } from "@src/modules/auth/register/register.dto";

@Injectable()
export class RegisterUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException("Un compte avec cet email existe déjà.");
    }

    const role = dto.role ?? UserRole.CLIENT;

    if (role === UserRole.COOK && !dto.cookProfile?.speciality) {
      throw new BadRequestException(
        "La spécialité est obligatoire pour un profil cuisinier."
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hashedPassword,
      role,
      thumbnail: dto.thumbnail ?? null,
    });
    await this.userRepository.save(user);

    if (role === UserRole.COOK) {
      const cook = this.cookRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        speciality: dto.cookProfile?.speciality,
        description: dto.cookProfile?.description ?? null,
        hourlyRate: dto.cookProfile?.hourlyRate ?? null,
        photoUrl: dto.thumbnail ?? null,
        userId: user.id,
      });
      await this.cookRepository.save(cook);
    } else {
      const client = this.clientRepository.create({ userId: user.id });
      await this.clientRepository.save(client);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt,
    });

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }
}
