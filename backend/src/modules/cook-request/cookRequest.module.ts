import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { CreateCookRequestController } from "@src/modules/cook-request/createCookRequest/createCookRequest.controller";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";
import { GetCookRequestController } from "@src/modules/cook-request/getCookRequest/getCookRequest.controller";
import { GetCookRequestUseCase } from "@src/modules/cook-request/getCookRequest/getCookRequest.useCase";
import { CancelCookRequestController } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.controller";
import { CancelCookRequestUseCase } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.useCase";

@Module({
  imports: [TypeOrmModule.forFeature([CookRequestEntity, Cook, Client])],
  controllers: [
    CreateCookRequestController,
    GetCookRequestController,
    CancelCookRequestController,
  ],
  providers: [
    CreateCookRequestUseCase,
    GetCookRequestUseCase,
    CancelCookRequestUseCase,
  ],
})
export class CookRequestModule {}
