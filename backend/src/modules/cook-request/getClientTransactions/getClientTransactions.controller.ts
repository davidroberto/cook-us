import { Controller, Get, Request } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetClientTransactionsUseCase } from "@src/modules/cook-request/getClientTransactions/getClientTransactions.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class GetClientTransactionsController {
  constructor(
    private readonly getClientTransactionsUseCase: GetClientTransactionsUseCase
  ) {}

  @Get("my/transactions")
  @ApiOperation({
    summary: "Consulter l'historique de ses transactions (client)",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des transactions payées",
  })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 404, description: "Client introuvable" })
  getMyTransactions(@Request() req) {
    return this.getClientTransactionsUseCase.execute(req.user.id);
  }
}
