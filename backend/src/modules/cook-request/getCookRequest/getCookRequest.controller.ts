import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetCookRequestUseCase } from "@src/modules/cook-request/getCookRequest/getCookRequest.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.COOK, UserRole.ADMIN)
export class GetCookRequestController {
  constructor(
    private readonly getCookRequestUseCase: GetCookRequestUseCase
  ) {}

  @Get(":id")
  @ApiOperation({ summary: "Consulter le détail d'une réservation (cook)" })
  @ApiParam({ name: "id", type: Number, description: "ID de la réservation" })
  @ApiResponse({
    status: 200,
    description: "Détail de la réservation avec les informations du cook et du client",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Rôle non autorisé (cook ou admin requis)" })
  @ApiResponse({ status: 404, description: "Réservation non trouvée" })
  getCookRequest(@Param("id", ParseIntPipe) id: number) {
    return this.getCookRequestUseCase.execute(id);
  }
}
