import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetPendingCooksUseCase } from "./getPendingCooks.useCase";

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetPendingCooksController {
  constructor(private readonly useCase: GetPendingCooksUseCase) {}

  @Get("pending-cooks")
  @ApiOperation({ summary: "Liste les cuisiniers en attente de validation" })
  execute() {
    return this.useCase.execute();
  }
}
