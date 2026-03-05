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
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { UpdateCookRequestAddressDto } from "./updateCookRequestAddress.dto";
import { UpdateCookRequestAddressUseCase } from "./updateCookRequestAddress.useCase";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT)
export class UpdateCookRequestAddressController {
  constructor(
    private readonly updateCookRequestAddressUseCase: UpdateCookRequestAddressUseCase
  ) {}

  @Patch(":id/address")
  @ApiOperation({ summary: "Modifier l'adresse d'une cook request" })
  @ApiResponse({ status: 200, description: "Adresse mise à jour" })
  @ApiResponse({
    status: 400,
    description: "Statut ne permet pas la modification",
  })
  @ApiResponse({ status: 403, description: "Non autorisé" })
  @ApiResponse({ status: 404, description: "Demande introuvable" })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCookRequestAddressDto,
    @Request() req: { user: { id: number } }
  ) {
    return this.updateCookRequestAddressUseCase.execute(id, dto, req.user.id);
  }
}
