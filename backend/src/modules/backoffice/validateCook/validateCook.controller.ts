import { Controller, Param, ParseIntPipe, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { ValidateCookUseCase } from "./validateCook.useCase";

@ApiTags("Backoffice")
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class ValidateCookController {
  constructor(private readonly validateCookUseCase: ValidateCookUseCase) {}

  @Patch("users/:id/validate")
  @ApiOperation({ summary: "Valider un cuisinier (admin)" })
  validate(@Param("id", ParseIntPipe) id: number) {
    return this.validateCookUseCase.execute(id);
  }
}
