import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { RolesGuard } from "@src/modules/auth/roles.guard";
import { UserRole } from "@src/modules/user/user.entity";
import { GetMyConversationsUseCase } from "@src/modules/conversation/getMyConversations/getMyConversations.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.CLIENT, UserRole.COOK)
@Controller("conversations")
export class GetMyConversationsController {
  constructor(
    private readonly getMyConversationsUseCase: GetMyConversationsUseCase
  ) {}

  @Get("me")
  @ApiOperation({
    summary: "Récupérer mes conversations (utilisateur connecté)",
  })
  @ApiResponse({ status: 200, description: "Liste de mes conversations" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({
    status: 403,
    description: "Accès réservé aux clients et cooks",
  })
  getMyConversations(@Req() req: { user: { id: number } }) {
    return this.getMyConversationsUseCase.execute(req.user.id);
  }
}
