import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetBackofficeUsersUseCase } from "./getBackofficeUsers.useCase";

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetBackofficeUsersController {
  constructor(private readonly useCase: GetBackofficeUsersUseCase) {}

  @Get("users")
  @ApiOperation({ summary: "Liste tous les utilisateurs (admin)" })
  getUsers() {
    return this.useCase.execute();
  }
}
