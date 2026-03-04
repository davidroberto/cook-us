import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { PayCookRequestUseCase } from "@src/modules/cook-request/payCookRequest/payCookRequest.useCase";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class PayCookRequestController {
  constructor(private readonly payCookRequestUseCase: PayCookRequestUseCase) {}

  @Patch(":id/pay")
  @ApiOperation({ summary: "Régler une prestation acceptée (client)" })
  @ApiResponse({ status: 200, description: "Prestation réglée avec succès" })
  @ApiResponse({ status: 400, description: "Statut non payable" })
  @ApiResponse({ status: 403, description: "Non autorisé" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  pay(@Param("id", ParseIntPipe) id: number, @Request() req) {
    return this.payCookRequestUseCase.execute(id, req.user.id);
  }
}
