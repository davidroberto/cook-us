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
import { GetConversationMessagesUseCase } from "@src/modules/conversation/getConversationMessages/getConversationMessages.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class GetConversationMessagesController {
  constructor(
    private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase
  ) {}

  @Get(":id/messages")
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: "Récupérer les messages d'une conversation" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 200, description: "Liste des messages" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({
    status: 403,
    description: "Vous n'êtes pas participant de cette conversation",
  })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  getMessages(@Param("id", ParseIntPipe) id: number) {
    return this.getConversationMessagesUseCase.execute(id);
  }
}
