import { Controller, Get, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetProfileUseCase } from "@src/modules/auth/getProfile/getProfile.useCase";

@ApiTags("Auth")
@Controller("auth")
export class GetProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get("me")
  @ApiOperation({ summary: "Récupérer son profil" })
  getProfile(@Request() req: { user: { id: number } }) {
    return this.getProfileUseCase.execute(req.user.id);
  }
}
