import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Public } from "@src/modules/auth/public.decorator";
import { CreateConversationUseCase } from "@src/modules/conversation/createConversation/createConversation.useCase";
import { CreateConversationDto } from "@src/modules/conversation/createConversation/createConversation.dto";

@ApiTags("Conversations")
@Public()
@Controller("conversations")
export class CreateConversationController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer une conversation avec des participants" })
  @ApiResponse({ status: 201, description: "Conversation créée avec succès" })
  @ApiResponse({ status: 400, description: "Données invalides" })
  create(@Body() dto: CreateConversationDto) {
    return this.createConversationUseCase.execute(dto);
  }
}
