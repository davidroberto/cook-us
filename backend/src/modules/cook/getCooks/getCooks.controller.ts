import { Controller, Get } from "@nestjs/common";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";

@Controller("cooks")
export class GetCooksController {
  constructor(private readonly getCooksUseCase: GetCooksUseCase) {}

  @Get()
  getCooks() {
    return this.getCooksUseCase.execute();
  }
}
