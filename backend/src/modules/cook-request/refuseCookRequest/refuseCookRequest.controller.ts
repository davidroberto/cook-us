import { Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { RefuseCookRequestUseCase } from "@src/modules/cook-request/refuseCookRequest/refuseCookRequest.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.COOK, UserRole.ADMIN)
export class RefuseCookRequestController {
  constructor(
    private readonly refuseCookRequestUseCase: RefuseCookRequestUseCase
  ) {}

  @Patch(":id/refuse")
  @ApiOperation({ summary: "Refuser une réservation (cook)" })
  @ApiResponse({
    status: 200,
    description: "Réservation refusée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 400, description: "Statut non refusable" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  refuse(@Param("id", ParseIntPipe) id: number) {
    return this.refuseCookRequestUseCase.execute(id);
  }
}
