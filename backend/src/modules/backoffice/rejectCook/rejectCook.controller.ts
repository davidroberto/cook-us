import { Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { RejectCookUseCase } from "./rejectCook.useCase";

@ApiTags("Backoffice")
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class RejectCookController {
  constructor(private readonly rejectCookUseCase: RejectCookUseCase) {}

  @Patch("users/:id/reject")
  @ApiOperation({ summary: "Rejeter un cuisinier (admin)" })
  reject(@Param("id", ParseIntPipe) id: number) {
    return this.rejectCookUseCase.execute(id);
  }
}
