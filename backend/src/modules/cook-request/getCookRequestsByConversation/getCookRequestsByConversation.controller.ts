import { Controller, Get, Param, ParseIntPipe, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetCookRequestsByConversationUseCase } from "@src/modules/cook-request/getCookRequestsByConversation/getCookRequestsByConversation.useCase";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.COOK)
export class GetCookRequestsByConversationController {
  constructor(
    private readonly getCookRequestsByConversationUseCase: GetCookRequestsByConversationUseCase
  ) {}

  @Get("conversation/:conversationId")
  @ApiOperation({
    summary:
      "Lister les demandes entre les deux participants d'une conversation",
  })
  getByConversation(
    @Param("conversationId", ParseIntPipe) conversationId: number,
    @Request() req: { user: { id: number } }
  ) {
    return this.getCookRequestsByConversationUseCase.execute(
      conversationId,
      req.user.id
    );
  }
}
