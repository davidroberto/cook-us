import { Body, Controller, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Public } from "@src/modules/auth/public.decorator";
import { AddParticipantUseCase } from "@src/modules/conversation/addParticipant/addParticipant.useCase";
import { AddParticipantDto } from "@src/modules/conversation/addParticipant/addParticipant.dto";

@ApiTags("Conversations")
@Public()
@Controller("conversations")
export class AddParticipantController {
  constructor(private readonly addParticipantUseCase: AddParticipantUseCase) {}

  @Post(":id/participants")
  @ApiOperation({ summary: "Ajouter un participant à une conversation" })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiResponse({ status: 201, description: "Participant ajouté" })
  @ApiResponse({ status: 404, description: "Conversation non trouvée" })
  addParticipant(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: AddParticipantDto
  ) {
    return this.addParticipantUseCase.execute(id, dto);
  }
}
