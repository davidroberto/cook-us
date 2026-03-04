import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "@src/modules/user/user.entity";
import { RefreshTokenDto } from "@src/modules/auth/refreshToken/refreshToken.dto";

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: RefreshTokenDto) {
    let payload: { sub: number; email: string; role: string };
    try {
      payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Refresh token invalide ou expiré.");
    }

    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.refreshToken")
      .where("user.id = :id", { id: payload.sub })
      .getOne();

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException("Refresh token invalide.");
    }

    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token expiré.");
    }

    const tokenValid = await bcrypt.compare(
      dto.refreshToken,
      user.refreshToken
    );
    if (!tokenValid) {
      await this.userRepository.update(user.id, {
        refreshToken: null,
        refreshTokenExpiresAt: null,
      });
      throw new UnauthorizedException(
        "Refresh token invalide. Tous les tokens ont été révoqués."
      );
    }

    const newPayload = { sub: user.id, email: user.email, role: user.role };

    const newToken = this.jwtService.sign(newPayload);

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: process.env.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as any,
    });

    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30);

    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
      refreshTokenExpiresAt,
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }
}
