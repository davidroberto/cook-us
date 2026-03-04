import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { CreateAdminUserUseCase } from "@src/modules/backoffice/createAdminUser.useCase";

class CreateAdminUserDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}

@ApiTags("Backoffice")
@ApiBearerAuth()
@Controller("backoffice/users")
@Roles(UserRole.ADMIN)
export class CreateAdminUserController {
  constructor(private readonly useCase: CreateAdminUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: "Créer un utilisateur administrateur" })
  create(@Body() dto: CreateAdminUserDto) {
    return this.useCase.execute(dto);
  }
}
