import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";
import { GetBackofficeUsersController } from "./getBackofficeUsers/getBackofficeUsers.controller";
import { GetBackofficeUsersUseCase } from "./getBackofficeUsers/getBackofficeUsers.useCase";
import { GetBackofficeUserController } from "./getBackofficeUser/getBackofficeUser.controller";
import { GetBackofficeUserUseCase } from "./getBackofficeUser/getBackofficeUser.useCase";
import { GetBackofficeCookRequestsController } from "./getBackofficeCookRequests/getBackofficeCookRequests.controller";
import { GetBackofficeCookRequestsUseCase } from "./getBackofficeCookRequests/getBackofficeCookRequests.useCase";
import { ValidateCookController } from "./validateCook/validateCook.controller";
import { ValidateCookUseCase } from "./validateCook/validateCook.useCase";
import { RejectCookController } from "./rejectCook/rejectCook.controller";
import { RejectCookUseCase } from "./rejectCook/rejectCook.useCase";
import { GetPendingCooksController } from "./getPendingCooks/getPendingCooks.controller";
import { GetPendingCooksUseCase } from "./getPendingCooks/getPendingCooks.useCase";

@Module({
  imports: [TypeOrmModule.forFeature([User, Cook, CookRequestEntity, Client])],
  controllers: [
    GetBackofficeUsersController,
    GetBackofficeUserController,
    GetBackofficeCookRequestsController,
    ValidateCookController,
    RejectCookController,
    GetPendingCooksController,
  ],
  providers: [
    GetBackofficeUsersUseCase,
    GetBackofficeUserUseCase,
    GetBackofficeCookRequestsUseCase,
    ValidateCookUseCase,
    RejectCookUseCase,
    GetPendingCooksUseCase,
  ],
})
export class BackofficeModule {}
