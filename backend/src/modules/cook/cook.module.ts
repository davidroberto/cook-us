import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Review } from "@src/modules/cook-request/review.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { CookProfileController } from "@src/modules/cook/cookProfile.controller";
import { CookRequest } from "@src/modules/cook/cookRequest.entity";
import { CookUnavailability } from "@src/modules/cook/cookUnavailability.entity";
import { GetCookController } from "@src/modules/cook/getCook/getCook.controller";
import { GetCookUseCase } from "@src/modules/cook/getCook/getCook.useCase";
import { GetCookProfileUseCase } from "@src/modules/cook/getCookProfile/getCookProfile.useCase";
import { GetCooksController } from "@src/modules/cook/getCooks/getCooks.controller";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";
import { GetCookStatsController } from "@src/modules/cook/getCookStats/getCookStats.controller";
import { GetCookStatsUseCase } from "@src/modules/cook/getCookStats/getCookStats.useCase";
import { UpdateCookProfileUseCase } from "@src/modules/cook/updateCookProfile/updateCookProfile.useCase";
import { CookCalendarController } from "@src/modules/cook/cookCalendar/cookCalendar.controller";
import { CookCalendarUseCase } from "@src/modules/cook/cookCalendar/cookCalendar.useCase";
import { User } from "@src/modules/user/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cook,
      CookImage,
      CookRequest,
      CookUnavailability,
      CookRequestEntity,
      Client,
      User,
      Review,
    ]),
  ],
  controllers: [
    GetCooksController,
    GetCookController,
    CookProfileController,
    GetCookStatsController,
    CookCalendarController,
  ],
  providers: [
    GetCooksUseCase,
    GetCookUseCase,
    GetCookProfileUseCase,
    UpdateCookProfileUseCase,
    GetCookStatsUseCase,
    CookCalendarUseCase,
  ],
})
export class CookModule {}
