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
import { UpdateCookRequestPriceUseCase } from "@src/modules/cook-request/updateCookRequestPrice/updateCookRequestPrice.useCase";
import { UpdateCookRequestPriceDto } from "@src/modules/cook-request/updateCookRequestPrice/updateCookRequestPrice.dto";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.COOK, UserRole.ADMIN)
export class UpdateCookRequestPriceController {
  constructor(
    private readonly updateCookRequestPriceUseCase: UpdateCookRequestPriceUseCase
  ) {}

  @Patch(":id/price")
  @ApiOperation({ summary: "Modifier le prix d'une réservation (cook)" })
  @ApiResponse({
    status: 200,
    description: "Prix mis à jour avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({
    status: 400,
    description: "Impossible de modifier le prix (réservation déjà payée)",
  })
  @ApiResponse({ status: 403, description: "Non autorisé" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  updatePrice(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCookRequestPriceDto,
    @Request() req
  ) {
    return this.updateCookRequestPriceUseCase.execute(
      id,
      req.user.id,
      dto.price
    );
  }
}
