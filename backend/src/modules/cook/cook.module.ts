import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { CookRequest } from "@src/modules/cook/cookRequest.entity";
import { Client } from "@src/modules/client/client.entity";
import { User } from "@src/modules/user/user.entity";
import { GetCooksController } from "@src/modules/cook/getCooks/getCooks.controller";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";

@Module({
  imports: [TypeOrmModule.forFeature([Cook, CookImage, CookRequest, Client, User])],
  controllers: [GetCooksController],
  providers: [GetCooksUseCase],
})
export class CookModule {}
