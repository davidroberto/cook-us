import { Controller, Get, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { GetMyConversationsUseCase } from "@src/modules/conversation/getMyConversations/getMyConversations.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class GetMyConversationsController {
  constructor(
    private readonly getMyConversationsUseCase: GetMyConversationsUseCase
  ) {}

  @Get("me")
  @ApiOperation({
    summary: "Récupérer mes conversations (utilisateur connecté)",
  })
  @ApiResponse({ status: 200, description: "Liste de mes conversations" })
  @ApiResponse({ status: 401, description: "Non authentifié" })
  getMyConversations(@Req() req: { user: { id: number } }) {
    return this.getMyConversationsUseCase.execute(req.user.id);
  }
}
