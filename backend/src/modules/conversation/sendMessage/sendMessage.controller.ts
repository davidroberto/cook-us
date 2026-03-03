import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
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
import { SendMessageUseCase } from "@src/modules/conversation/sendMessage/sendMessage.useCase";
import { SendMessageDto } from "@src/modules/conversation/sendMessage/sendMessage.dto";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class SendMessageController {
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  @Post(":id/messages")
  @UseGuards(ConversationParticipantGuard)
  @ApiOperation({ summary: "Envoyer un message dans une conversation" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 201, description: "Message envoyé" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  @ApiResponse({
    status: 403,
    description: "Vous n'êtes pas participant de cette conversation",
  })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  sendMessage(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
    @Req() req: { user: { id: number } }
  ) {
    return this.sendMessageUseCase.execute(id, req.user.id, dto);
  }
}
