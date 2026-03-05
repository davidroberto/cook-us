import { Body, Controller, Get, Patch, Request } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetCookProfileUseCase } from "@src/modules/cook/getCookProfile/getCookProfile.useCase";
import { UpdateCookProfileUseCase } from "@src/modules/cook/updateCookProfile/updateCookProfile.useCase";
import { UpdateCookProfileDto } from "@src/modules/cook/updateCookProfile/updateCookProfile.dto";

@ApiTags("Cook")
@Controller("cook")
@Roles(UserRole.COOK)
export class CookProfileController {
  constructor(
    private readonly getCookProfileUseCase: GetCookProfileUseCase,
    private readonly updateCookProfileUseCase: UpdateCookProfileUseCase
  ) {}

  @Get("profile")
  @ApiOperation({ summary: "Récupérer son profil cuisinier" })
  getProfile(@Request() req: { user: { id: number } }) {
    return this.getCookProfileUseCase.execute(req.user.id);
  }

  @Patch("profile")
  @ApiOperation({ summary: "Mettre à jour son profil cuisinier" })
  updateProfile(
    @Request() req: { user: { id: number } },
    @Body() dto: UpdateCookProfileDto
  ) {
    return this.updateCookProfileUseCase.execute(req.user.id, dto);
  }
}
