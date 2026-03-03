import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
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
import { AddParticipantUseCase } from "@src/modules/conversation/addParticipant/addParticipant.useCase";
import { AddParticipantDto } from "@src/modules/conversation/addParticipant/addParticipant.dto";

@ApiTags("Conversations")
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller("conversations")
export class AddParticipantController {
  constructor(private readonly addParticipantUseCase: AddParticipantUseCase) {}

  @Post(":id/participants")
  @ApiOperation({ summary: "Ajouter un participant à une conversation" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 201, description: "Participant ajouté" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({ status: 403, description: "Accès réservé aux admins" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  addParticipant(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AddParticipantDto
  ) {
    return this.addParticipantUseCase.execute(id, dto);
  }
}
