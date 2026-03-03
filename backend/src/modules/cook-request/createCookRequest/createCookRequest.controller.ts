import { Body, Controller, Post, Request } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class CreateCookRequestController {
  constructor(
    private readonly createCookRequestUseCase: CreateCookRequestUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer une demande de prestation cuisinier" })
  @ApiResponse({
    status: 201,
    description: "Demande créée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 400, description: "Données invalides" })
  @ApiResponse({ status: 404, description: "Client introuvable" })
  create(@Body() dto: CreateCookRequestDto, @Request() req) {
    return this.createCookRequestUseCase.execute(dto, req.user.id);
  }
}
