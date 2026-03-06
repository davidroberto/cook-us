import { Controller, Get, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
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
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  getForMe(
    @Request() req: { user: { id: number } },
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    return this.getCookCookRequestsUseCase.execute(
      req.user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20
    );
  }
}
