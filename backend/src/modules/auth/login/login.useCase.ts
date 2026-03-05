import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { LoginDto } from "@src/modules/auth/login/login.dto";

@Injectable()
export class LoginUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: dto.email })
      .getOne();
    if (!user) {
      throw new UnauthorizedException("Email ou mot de passe incorrect.");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException("Email ou mot de passe incorrect.");
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

    let siret: string | null = null;
    if (user.role === UserRole.COOK) {
      const cook = await this.cookRepository.findOne({
        where: { userId: user.id },
        select: { siret: true },
      });
      siret = cook?.siret ?? null;
    }

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        thumbnail: user.thumbnail ?? null,
        ...(user.role === UserRole.COOK && { siret }),
      },
    };
  }
}
