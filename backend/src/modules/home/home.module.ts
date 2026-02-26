import { Module } from "@nestjs/common";
import { GetAppNameController } from "@src/modules/home/getAppName/getAppName.controller";
import { GetAppNameUseCase } from "@src/modules/home/getAppName/getAppName.useCase";

@Module({
  controllers: [GetAppNameController],
  providers: [GetAppNameUseCase],
})
export class HomeModule {}
