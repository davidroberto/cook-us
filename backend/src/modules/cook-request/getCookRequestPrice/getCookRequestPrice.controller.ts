import { Controller, Get, Param, ParseIntPipe, Request } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetCookRequestPriceUseCase } from "@src/modules/cook-request/getCookRequestPrice/getCookRequestPrice.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";

class CookRequestPriceResponse {
  @ApiProperty({ example: 150, description: "Prix fixé par le cuisinier (€)" })
  subtotal: number;

  @ApiProperty({
    example: 0.3,
    description: "Taux de commission de la plateforme",
  })
  commissionRate: number;

  @ApiProperty({ example: 45, description: "Montant de la commission (€)" })
  commission: number;

  @ApiProperty({ example: 195, description: "Total à payer (€)" })
  total: number;
}

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.COOK, UserRole.ADMIN)
export class GetCookRequestPriceController {
  constructor(
    private readonly getCookRequestPriceUseCase: GetCookRequestPriceUseCase
  ) {}

  @Get(":id/price")
  @ApiOperation({
    summary: "Consulter le détail du prix d'une réservation acceptée (client)",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la réservation" })
  @ApiResponse({
    status: 200,
    description: "Détail du prix : prix du cook + 30% commission = total",
    type: CookRequestPriceResponse,
  })
  @ApiResponse({
    status: 400,
    description: "Réservation non acceptée ou prix non défini",
  })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Accès non autorisé" })
  @ApiResponse({ status: 404, description: "Réservation non trouvée" })
  getCookRequestPrice(
    @Param("id", ParseIntPipe) id: number,
    @Request() req: { user: { id: number; role: UserRole } }
  ) {
    return this.getCookRequestPriceUseCase.execute(id, req.user);
  }
}
