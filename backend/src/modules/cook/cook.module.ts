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
import { CookProfileController } from "@src/modules/cook/cookProfile.controller";
import { GetCookProfileUseCase } from "@src/modules/cook/getCookProfile/getCookProfile.useCase";
import { UpdateCookProfileUseCase } from "@src/modules/cook/updateCookProfile/updateCookProfile.useCase";
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
  controllers: [GetCooksController, GetCookController, CookProfileController],
  providers: [GetCooksUseCase, GetCookUseCase, GetCookProfileUseCase, UpdateCookProfileUseCase],
})
export class CookModule {}
