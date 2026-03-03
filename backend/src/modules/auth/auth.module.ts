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
  controllers: [RegisterController, LoginController],
  providers: [JwtStrategy, RegisterUseCase, LoginUseCase],
  exports: [JwtModule],
})
export class AuthModule {}
