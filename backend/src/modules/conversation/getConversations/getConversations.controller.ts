import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import { Public } from "@src/modules/auth/public.decorator";
import { GetConversationsUseCase } from "@src/modules/conversation/getConversations/getConversations.useCase";

@ApiTags("Conversations")
@Public()
@Controller("conversations")
export class GetConversationsController {
  constructor(
    private readonly getConversationsUseCase: GetConversationsUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: "Lister les conversations" })
  @ApiQuery({
    name: "userId",
    required: false,
    type: Number,
    description: "Filtrer par ID utilisateur participant",
  })
  @ApiResponse({ status: 200, description: "Liste des conversations" })
  getConversations(@Query("userId") userId?: number) {
    return this.getConversationsUseCase.execute(
      userId ? Number(userId) : undefined
    );
  }
}
