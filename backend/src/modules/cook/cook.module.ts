import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import { Review } from "@src/modules/cook-request/review.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { CookRequest } from "@src/modules/cook/cookRequest.entity";
import { GetCookController } from "@src/modules/cook/getCook/getCook.controller";
import { GetCookUseCase } from "@src/modules/cook/getCook/getCook.useCase";
import { GetCooksController } from "@src/modules/cook/getCooks/getCooks.controller";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";
import { User } from "@src/modules/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cook,
      CookImage,
      CookRequest,
      Client,
      User,
      Review,
    ]),
  ],
  controllers: [GetCooksController, GetCookController],
  providers: [GetCooksUseCase, GetCookUseCase],
})
export class CookModule {}
