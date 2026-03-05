import { Body, Controller, Patch, Request } from "@nestjs/common";
import { RegisterPushTokenDto } from "@src/modules/auth/registerPushToken/registerPushToken.dto";
import { RegisterPushTokenUseCase } from "@src/modules/auth/registerPushToken/registerPushToken.useCase";

@Controller("auth")
export class RegisterPushTokenController {
  constructor(
    private readonly registerPushTokenUseCase: RegisterPushTokenUseCase
  ) {}

  @Patch("push-token")
  async registerPushToken(
    @Request() req: { user: { id: number } },
    @Body() dto: RegisterPushTokenDto
  ) {
    await this.registerPushTokenUseCase.execute(req.user.id, dto.expoPushToken);
    return { success: true };
  }
}
