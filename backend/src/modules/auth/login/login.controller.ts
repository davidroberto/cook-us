import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUseCase } from "@src/modules/auth/login/login.useCase";
import { LoginDto } from "@src/modules/auth/login/login.dto";

@ApiTags("Auth")
@Controller("auth")
export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @ApiOperation({
    summary: "Se connecter",
    description: "Connexion avec email et mot de passe. Retourne un token JWT.",
  })
  @ApiResponse({
    status: 200,
    description: "Connexion réussie. Retourne le token JWT et les données utilisateur.",
  })
  @ApiResponse({
    status: 401,
    description: "Email ou mot de passe incorrect.",
  })
  login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto);
  }
}
