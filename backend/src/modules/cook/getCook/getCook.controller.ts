import { Controller, Get, Param } from "@nestjs/common";
import { Public } from "@src/modules/auth/public.decorator";
import { GetCookUseCase } from "@src/modules/cook/getCook/getCook.useCase";
import { CookCalendarUseCase } from "@src/modules/cook/cookCalendar/cookCalendar.useCase";

@Controller("cooks")
export class GetCookController {
  constructor(
    private readonly getCookUseCase: GetCookUseCase,
    private readonly cookCalendarUseCase: CookCalendarUseCase
  ) {}

  @Public()
  @Get(":id")
  getCook(@Param("id") id: string) {
    return this.getCookUseCase.execute(id);
  }

  @Public()
  @Get(":id/unavailabilities")
  getUnavailabilities(@Param("id") id: string) {
    return this.cookCalendarUseCase.getPublicUnavailabilities(id);
  }
}
