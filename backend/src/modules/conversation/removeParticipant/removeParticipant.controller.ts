import {
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { RolesGuard } from "@src/modules/auth/roles.guard";
import { UserRole } from "@src/modules/user/user.entity";
import { RemoveParticipantUseCase } from "@src/modules/conversation/removeParticipant/removeParticipant.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("conversations")
export class RemoveParticipantController {
  constructor(
    private readonly removeParticipantUseCase: RemoveParticipantUseCase
  ) {}

  @Delete(":id/participants/:userId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Retirer un participant d'une conversation (soft delete)",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiParam({
    name: "userId",
    type: Number,
    description: "ID de l'utilisateur à retirer",
  })
  @ApiResponse({ status: 204, description: "Participant retiré" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Accès réservé aux admins" })
  @ApiResponse({ status: 404, description: "Participant non trouvé" })
  removeParticipant(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    return this.removeParticipantUseCase.execute(id, userId);
  }
}
