import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Public } from "@src/modules/auth/public.decorator";
import { GetConversationUseCase } from "@src/modules/conversation/getConversation/getConversation.useCase";

@ApiTags("Conversations")
@Public()
@Controller("conversations")
export class GetConversationController {
  constructor(
    private readonly getConversationUseCase: GetConversationUseCase
  ) {}

  @Get(":id")
  @ApiOperation({
    summary: "Consulter une conversation avec ses participants et messages",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 200, description: "Détail de la conversation" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  getConversation(@Param("id", ParseIntPipe) id: number) {
    return this.getConversationUseCase.execute(id);
  }
}
