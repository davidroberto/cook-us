import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { RolesGuard } from "@src/modules/auth/roles.guard";
import { UserRole } from "@src/modules/user/user.entity";
import { GetConversationsUseCase } from "@src/modules/conversation/getConversations/getConversations.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("conversations")
export class GetConversationsController {
  constructor(
    private readonly getConversationsUseCase: GetConversationsUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: "Lister les conversations" })
  @ApiQuery({
    name: "userId",
    required: false,
    type: Number,
    description: "Filtrer par ID utilisateur participant",
  })
  @ApiResponse({ status: 200, description: "Liste des conversations" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Accès réservé aux admins" })
  getConversations(@Query("userId") userId?: number) {
    return this.getConversationsUseCase.execute(
      userId ? Number(userId) : undefined
    );
  }
}
