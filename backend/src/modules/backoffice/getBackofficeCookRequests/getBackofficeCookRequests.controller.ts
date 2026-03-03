import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetBackofficeCookRequestsUseCase } from "./getBackofficeCookRequests.useCase";

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetBackofficeCookRequestsController {
  constructor(private readonly useCase: GetBackofficeCookRequestsUseCase) {}

  @Get("cook-requests")
  @ApiOperation({ summary: "Liste toutes les demandes de cuisine (admin)" })
  getCookRequests() {
    return this.useCase.execute();
  }
}
