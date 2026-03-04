import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetBackofficeUsersUseCase } from "./getBackofficeUsers.useCase";

class CreateAdminUserDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetBackofficeUsersController {
  constructor(private readonly useCase: GetBackofficeUsersUseCase) {}

  @Get("users")
  @ApiOperation({ summary: "Liste tous les utilisateurs (admin)" })
  getUsers() {
    return this.useCase.execute();
  }

  @Post("users")
  @HttpCode(201)
  @ApiOperation({ summary: "Créer un administrateur" })
  createAdmin(@Body() dto: CreateAdminUserDto) {
    return this.useCase.createAdmin(dto);
  }
}
