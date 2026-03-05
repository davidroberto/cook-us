import { Controller, Get, Request } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GetClientCookRequestsUseCase } from "@src/modules/cook-request/getClientCookRequests/getClientCookRequests.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class GetClientCookRequestsController {
  constructor(
    private readonly getClientCookRequestsUseCase: GetClientCookRequestsUseCase
  ) {}

  @Get("my")
  @ApiOperation({
    summary: "Lister mes réservations et suivre leur statut",
  })
  @ApiResponse({
    status: 200,
    description: "Liste des réservations du client avec leur statut",
    type: [CookRequestEntity],
  })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 404, description: "Client introuvable" })
  getMyRequests(@Request() req) {
    return this.getClientCookRequestsUseCase.execute(req.user.id);
  }


}
