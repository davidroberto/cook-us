import { Body, Controller, Post, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChangePasswordUseCase } from "@src/modules/auth/changePassword/changePassword.useCase";
import { ChangePasswordDto } from "@src/modules/auth/changePassword/changePassword.dto";

@ApiTags("Auth")
@Controller("auth")
export class ChangePasswordController {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {}

  @Post("change-password")
  @ApiOperation({ summary: "Changer son mot de passe" })
  changePassword(
    @Request() req: { user: { id: number } },
    @Body() dto: ChangePasswordDto
  ) {
    return this.changePasswordUseCase.execute(req.user.id, dto);
  }
}
