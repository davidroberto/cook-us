import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";
import { CreateCookRequestDto } from "@src/modules/cook-request/createCookRequest/createCookRequest.dto";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@Controller("cook-request")
export class CreateCookRequestController {
  constructor(
    private readonly createCookRequestUseCase: CreateCookRequestUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer une demande de prestation cuisinier" })
  @ApiResponse({
    status: 201,
    description: "Demande créée avec succès",
    type: CookRequestEntity,
  })
  @ApiResponse({ status: 400, description: "Données invalides" })
  create(@Body() dto: CreateCookRequestDto) {
    return this.createCookRequestUseCase.execute(dto);
  }
}
