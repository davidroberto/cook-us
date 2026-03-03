import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetBackofficeUserUseCase } from "./getBackofficeUser.useCase";

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetBackofficeUserController {
  constructor(private readonly useCase: GetBackofficeUserUseCase) {}

  @Get("users/:id")
  @ApiOperation({ summary: "Détail d'un utilisateur (admin)" })
  getUser(@Param("id", ParseIntPipe) id: number) {
    return this.useCase.execute(id);
  }
}
