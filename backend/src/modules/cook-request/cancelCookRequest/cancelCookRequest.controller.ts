import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CancelCookRequestUseCase } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.useCase";
import { CancelCookRequestDto } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.dto";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class CancelCookRequestController {
  constructor(
    private readonly cancelCookRequestUseCase: CancelCookRequestUseCase
  ) {}

  @Patch(":id/cancel")
  @ApiOperation({ summary: "Annuler une réservation avec motif" })
  @ApiResponse({
    status: 200,
    description: "Réservation annulée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 400, description: "Statut non annulable" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  cancel(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: CancelCookRequestDto,
    @Request() req
  ) {
    return this.cancelCookRequestUseCase.execute(id, dto, req.user.id);
  }
}
