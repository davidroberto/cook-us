import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { GetConversationMessagesUseCase } from "@src/modules/conversation/getConversationMessages/getConversationMessages.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class GetConversationMessagesController {
  constructor(
    private readonly getConversationMessagesUseCase: GetConversationMessagesUseCase
  ) {}

  @Get(":id/messages")
  @ApiOperation({ summary: "Récupérer les messages d'une conversation" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 200, description: "Liste des messages" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  getMessages(@Param("id", ParseIntPipe) id: number) {
    return this.getConversationMessagesUseCase.execute(id);
  }
}
