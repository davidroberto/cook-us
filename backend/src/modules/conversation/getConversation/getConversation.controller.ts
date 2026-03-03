import {
  Controller,
  Get,
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
import { ConversationParticipantGuard } from "@src/modules/conversation/conversationParticipant.guard";
import { GetConversationUseCase } from "@src/modules/conversation/getConversation/getConversation.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class GetConversationController {
  constructor(
    private readonly getConversationUseCase: GetConversationUseCase
  ) {}

  @Get(":id")
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({
    summary: "Consulter une conversation avec ses participants et messages",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 200, description: "Détail de la conversation" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({
    status: 403,
    description: "Vous n'êtes pas participant de cette conversation",
  })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  getConversation(@Param("id", ParseIntPipe) id: number) {
    return this.getConversationUseCase.execute(id);
  }
}
