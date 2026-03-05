import { Controller, Get, Req } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { GetUnreadCountsUseCase } from "@src/modules/conversation/getUnreadCounts/getUnreadCounts.useCase";

@ApiTags("Conversations")
@ApiBearerAuth()
@Controller("conversations")
export class GetUnreadCountsController {
  constructor(
    private readonly getUnreadCountsUseCase: GetUnreadCountsUseCase
  ) {}

  @Get("unread-counts")
  @ApiOperation({
    summary: "Récupérer le nombre de messages non lus par conversation",
  })
  @ApiResponse({
    status: 200,
    description: "Compteurs de messages non lus par conversation",
  })
  getUnreadCounts(@Req() req: { user: { id: number } }) {
    return this.getUnreadCountsUseCase.execute(req.user.id);
  }
}
