import { Controller, Get } from "@nestjs/common";
import { Public } from "@src/modules/auth/public.decorator";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";

@Controller("cooks")
export class GetCooksController {
  constructor(private readonly getCooksUseCase: GetCooksUseCase) {}

  @Public()
  @Get()
  getCooks() {
    return this.getCooksUseCase.execute();
  }
}
