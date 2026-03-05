import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
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
  @ApiOperation({
    summary: "Récupérer les messages d'une conversation (paginés)",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Numéro de page (défaut: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Nombre de messages par page (défaut: 20)",
  })
  @ApiResponse({
    status: 200,
    description: "Messages paginés (du plus récent au plus ancien)",
  })
  @ApiResponse({ status: 403, description: "Non participant" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  getMessages(
    @Param("id", ParseIntPipe) id: number,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number
  ) {
    return this.getConversationMessagesUseCase.execute(id, page, limit);
  }
}
