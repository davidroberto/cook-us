import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestController } from "@src/modules/cook-request/createCookRequest/createCookRequest.controller";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";

@Module({
  imports: [TypeOrmModule.forFeature([CookRequestEntity])],
  controllers: [CreateCookRequestController],
  providers: [CreateCookRequestUseCase],
})
export class CookRequestModule {}
