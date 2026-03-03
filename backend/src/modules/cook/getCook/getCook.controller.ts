import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "@src/modules/auth/public.decorator";
import { GetCookUseCase } from "@src/modules/cook/getCook/getCook.useCase";

@Controller("cooks")
export class GetCookController {
  constructor(private readonly getCookUseCase: GetCookUseCase) {}

  @Public()
  @Get(":id")
  getCook(@Param("id") id: string) {
    return this.getCookUseCase.execute(id);
  }
}
