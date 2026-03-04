import { Body, Controller, Patch, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateProfileUseCase } from "@src/modules/auth/updateProfile/updateProfile.useCase";
import { UpdateProfileDto } from "@src/modules/auth/updateProfile/updateProfile.dto";

@ApiTags("Auth")
@Controller("auth")
export class UpdateProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Patch("me")
  @ApiOperation({ summary: "Mettre à jour son profil (firstName, lastName, email)" })
  updateProfile(@Request() req: { user: { id: number } }, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(req.user.id, dto);
  }
}
