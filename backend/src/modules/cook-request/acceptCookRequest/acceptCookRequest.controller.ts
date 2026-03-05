import {
  Body,
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
import { AcceptCookRequestUseCase } from "@src/modules/cook-request/acceptCookRequest/acceptCookRequest.useCase";
import { AcceptCookRequestDto } from "@src/modules/cook-request/acceptCookRequest/acceptCookRequest.dto";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.COOK, UserRole.ADMIN)
export class AcceptCookRequestController {
  constructor(
    private readonly acceptCookRequestUseCase: AcceptCookRequestUseCase
  ) {}

  @Patch(":id/accept")
  @ApiOperation({ summary: "Accepter une réservation (cook)" })
  @ApiResponse({
    status: 200,
    description: "Réservation acceptée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 400, description: "Statut non acceptable" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  accept(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AcceptCookRequestDto,
    @Request() req
  ) {
    return this.acceptCookRequestUseCase.execute(id, req.user.id, dto.price);
  }
}
