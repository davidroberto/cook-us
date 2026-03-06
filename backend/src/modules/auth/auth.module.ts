import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { JwtStrategy } from "@src/modules/auth/jwt.strategy";
import { RegisterController } from "@src/modules/auth/register/register.controller";
import { RegisterUseCase } from "@src/modules/auth/register/register.useCase";
import { LoginController } from "@src/modules/auth/login/login.controller";
import { LoginUseCase } from "@src/modules/auth/login/login.useCase";
import { UpdateProfileController } from "@src/modules/auth/updateProfile/updateProfile.controller";
import { UpdateProfileUseCase } from "@src/modules/auth/updateProfile/updateProfile.useCase";
import { ChangePasswordController } from "@src/modules/auth/changePassword/changePassword.controller";
import { ChangePasswordUseCase } from "@src/modules/auth/changePassword/changePassword.useCase";
import { RefreshTokenController } from "@src/modules/auth/refreshToken/refreshToken.controller";
import { RefreshTokenUseCase } from "@src/modules/auth/refreshToken/refreshToken.useCase";
import { GetProfileController } from "@src/modules/auth/getProfile/getProfile.controller";
import { GetProfileUseCase } from "@src/modules/auth/getProfile/getProfile.useCase";
import { RegisterPushTokenController } from "@src/modules/auth/registerPushToken/registerPushToken.controller";
import { RegisterPushTokenUseCase } from "@src/modules/auth/registerPushToken/registerPushToken.useCase";
import { GoogleAuthController } from "@src/modules/auth/googleAuth/googleAuth.controller";
import { GoogleAuthUseCase } from "@src/modules/auth/googleAuth/googleAuth.useCase";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as any },
    }),
    TypeOrmModule.forFeature([User, Cook, Client]),
  ],
  controllers: [
    RegisterController,
    LoginController,
    GetProfileController,
    UpdateProfileController,
    ChangePasswordController,
    RefreshTokenController,
    RegisterPushTokenController,
    GoogleAuthController,
  ],
  providers: [
    JwtStrategy,
    RegisterUseCase,
    LoginUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    ChangePasswordUseCase,
    RefreshTokenUseCase,
    RegisterPushTokenUseCase,
    GoogleAuthUseCase,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
