import { Body, Controller, Post } from "@nestjs/common";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";

@Roles(UserRole.CLIENT, UserRole.ADMIN)
@Controller("cook-request")
export class CreateCookRequestController {
  constructor(
    private readonly createCookRequestUseCase: CreateCookRequestUseCase
  ) {}

  @Post()
  create(@Body() dto: CreateCookRequestDto) {
    return this.createCookRequestUseCase.execute(dto);
  }
}
