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
import { CompleteCookRequestUseCase } from "@src/modules/cook-request/completeCookRequest/completeCookRequest.useCase";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class CompleteCookRequestController {
  constructor(
    private readonly completeCookRequestUseCase: CompleteCookRequestUseCase
  ) {}

  @Patch(":id/complete")
  @ApiOperation({ summary: "Marquer une réservation comme complétée (client)" })
  @ApiResponse({
    status: 200,
    description: "Réservation complétée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({
    status: 400,
    description: "Statut non complétable ou date non passée",
  })
  @ApiResponse({ status: 403, description: "Non autorisé" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  complete(@Param("id", ParseIntPipe) id: number, @Request() req) {
    return this.completeCookRequestUseCase.execute(id, req.user.id);
  }
}
