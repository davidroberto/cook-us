import { Controller, Get, Query } from "@nestjs/common";
import { Public } from "@src/modules/auth/public.decorator";
import { GetCooksUseCase } from "@src/modules/cook/getCooks/getCooks.useCase";
import { GetCooksQueryDto } from "@src/modules/cook/getCooks/getCooks.dto";

@Controller("cooks")
export class GetCooksController {
  constructor(private readonly getCooksUseCase: GetCooksUseCase) {}

  @Public()
  @Get()
  getCooks(@Query() query: GetCooksQueryDto) {
    return this.getCooksUseCase.execute(query);
  }
}
