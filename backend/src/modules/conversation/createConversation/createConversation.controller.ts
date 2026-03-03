import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { RolesGuard } from "@src/modules/auth/roles.guard";
import { UserRole } from "@src/modules/user/user.entity";
import { CreateConversationUseCase } from "@src/modules/conversation/createConversation/createConversation.useCase";
import { CreateConversationDto } from "@src/modules/conversation/createConversation/createConversation.dto";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("conversations")
export class CreateConversationController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer une conversation avec des participants" })
  @ApiResponse({ status: 201, description: "Conversation créée avec succès" })
  @ApiResponse({ status: 400, description: "Données invalides" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Accès réservé aux admins" })
  create(@Body() dto: CreateConversationDto) {
    return this.createConversationUseCase.execute(dto);
  }
}
