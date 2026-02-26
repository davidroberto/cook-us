import { Controller, Get } from "@nestjs/common";
import { GetAppNameUseCase } from "@src/modules/home/getAppName/getAppName.useCase";

@Controller("home")
export class GetAppNameController {
  constructor(private readonly getAppNameUseCase: GetAppNameUseCase) {}

  @Get("app-name")
  getAppName() {
    return this.getAppNameUseCase.execute();
  }
}
