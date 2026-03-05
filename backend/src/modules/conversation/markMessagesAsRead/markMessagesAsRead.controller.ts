import {
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ConversationParticipantGuard } from "@src/modules/conversation/conversationParticipant.guard";
import { MarkMessagesAsReadUseCase } from "@src/modules/conversation/markMessagesAsRead/markMessagesAsRead.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class MarkMessagesAsReadController {
  constructor(
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase
  ) {}

  @Patch(":id/messages/read")
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: "Marquer tous les messages non lus comme lus" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 200, description: "Messages marqués comme lus" })
  @ApiResponse({ status: 403, description: "Non participant" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  markAsRead(
    @Param("id", ParseIntPipe) id: number,
    @Req() req: { user: { id: number } }
  ) {
    return this.markMessagesAsReadUseCase.execute(id, req.user.id);
  }
}
