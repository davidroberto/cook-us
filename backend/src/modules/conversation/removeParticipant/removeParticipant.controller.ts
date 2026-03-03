import {
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Public } from "@src/modules/auth/public.decorator";
import { RemoveParticipantUseCase } from "@src/modules/conversation/removeParticipant/removeParticipant.useCase";

@ApiTags("Conversations")
@Public()
@Controller("conversations")
export class RemoveParticipantController {
  constructor(
    private readonly removeParticipantUseCase: RemoveParticipantUseCase
  ) {}

  @Delete(":id/participants/:userId")
  @HttpCode(204)
  @ApiOperation({
    summary: "Retirer un participant d'une conversation (soft delete)",
  })
  @ApiParam({ name: "id", type: Number, description: "ID de la conversation" })
  @ApiParam({
    name: "userId",
    type: Number,
    description: "ID de l'utilisateur à retirer",
  })
  @ApiResponse({ status: 204, description: "Participant retiré" })
  @ApiResponse({ status: 404, description: "Participant non trouvé" })
  removeParticipant(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    return this.removeParticipantUseCase.execute(id, userId);
  }
}
