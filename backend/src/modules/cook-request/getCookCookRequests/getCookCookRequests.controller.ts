import { Controller, Get, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetCookCookRequestsUseCase } from "@src/modules/cook-request/getCookCookRequests/getCookCookRequests.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.COOK)
export class GetCookCookRequestsController {
  constructor(
    private readonly getCookCookRequestsUseCase: GetCookCookRequestsUseCase
  ) {}

  @Get("for-me")
  @ApiOperation({ summary: "Lister les propositions reçues (cook)" })
  getForMe(@Request() req: { user: { id: number } }) {
    return this.getCookCookRequestsUseCase.execute(req.user.id);
  }
}
