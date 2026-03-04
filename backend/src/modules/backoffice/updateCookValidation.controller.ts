import { Controller, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { UpdateCookValidationUseCase } from "@src/modules/backoffice/updateCookValidation.useCase";

@ApiTags("Backoffice")
@ApiBearerAuth()
@Controller("backoffice/cooks")
@Roles(UserRole.ADMIN)
export class UpdateCookValidationController {
  constructor(private readonly useCase: UpdateCookValidationUseCase) {}

  @Patch(":cookId/validate")
  @ApiOperation({ summary: "Approuver un profil cuisinier" })
  approve(@Param("cookId") cookId: string) {
    return this.useCase.execute(cookId, true);
  }

  @Patch(":cookId/refuse")
  @ApiOperation({ summary: "Refuser un profil cuisinier" })
  refuse(@Param("cookId") cookId: string) {
    return this.useCase.execute(cookId, false);
  }
}
