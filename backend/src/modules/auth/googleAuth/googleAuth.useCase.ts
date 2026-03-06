import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { GoogleAuthDto } from "@src/modules/auth/googleAuth/googleAuth.dto";

@Injectable()
export class GoogleAuthUseCase {
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async execute(dto: GoogleAuthDto) {
    const googleUser = await this.verifyGoogleToken(dto.idToken);

    const existingUser = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (existingUser) {
      return this.loginExistingUser(existingUser, dto.expoPushToken);
    }

    if (!dto.role) {
      return {
        needsRegistration: true,
        googleUser: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          thumbnail: googleUser.picture,
        },
      };
    }

    return this.registerNewUser(dto, googleUser);
  }

  private async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException("Token Google invalide.");
      }
      return {
        email: payload.email,
        firstName: payload.given_name ?? "",
        lastName: payload.family_name ?? "",
        picture: payload.picture ?? null,
      };
    } catch {
      throw new UnauthorizedException(
        "Impossible de vérifier le token Google."
      );
    }
  }

  private async loginExistingUser(user: User, expoPushToken?: string) {
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
      ...(expoPushToken && { expoPushToken }),
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

  private async registerNewUser(
    dto: GoogleAuthDto,
    googleUser: {
      email: string;
      firstName: string;
      lastName: string;
      picture: string | null;
    }
  ) {
    const role = dto.role!;

    if (role === UserRole.COOK && !dto.cookProfile?.speciality) {
      throw new BadRequestException(
        "La spécialité est obligatoire pour un profil cuisinier."
      );
    }
    if (role === UserRole.COOK && !dto.cookProfile?.siret) {
      throw new BadRequestException(
        "Le SIRET est obligatoire pour un profil cuisinier."
      );
    }
    if (role === UserRole.COOK && !dto.cookProfile?.city?.trim()) {
      throw new BadRequestException(
        "La ville est obligatoire pour un profil cuisinier."
      );
    }

    const randomPassword = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const user = this.userRepository.create({
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      email: googleUser.email,
      password: hashedPassword,
      role,
      thumbnail: googleUser.picture,
    });
    await this.userRepository.save(user);

    if (role === UserRole.COOK) {
      const cook = this.cookRepository.create({
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        speciality: dto.cookProfile!.speciality,
        siret: dto.cookProfile!.siret,
        city: dto.cookProfile!.city,
        description: dto.cookProfile?.description ?? null,
        hourlyRate: dto.cookProfile?.hourlyRate ?? null,
        photoUrl: googleUser.picture,
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
        thumbnail: user.thumbnail ?? null,
        ...(role === UserRole.COOK && { siret: dto.cookProfile?.siret }),
      },
    };
  }
}
