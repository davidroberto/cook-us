import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { GetCookRequestUseCase } from "@src/modules/cook-request/getCookRequest/getCookRequest.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@Controller("cook-request")
@Roles(UserRole.COOK, UserRole.ADMIN)
export class GetCookRequestController {
  constructor(
    private readonly getCookRequestUseCase: GetCookRequestUseCase
  ) {}

  @Get(":id")
  @ApiOperation({ summary: "Consulter le détail d'une réservation" })
  @ApiResponse({
    status: 200,
    description: "Détail de la réservation",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 404, description: "Réservation non trouvée" })
  getCookRequest(@Param("id", ParseIntPipe) id: number) {
    return this.getCookRequestUseCase.execute(id);
  }
}
