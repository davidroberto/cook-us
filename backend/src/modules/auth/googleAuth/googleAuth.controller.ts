import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GoogleAuthUseCase } from "@src/modules/auth/googleAuth/googleAuth.useCase";
import { GoogleAuthDto } from "@src/modules/auth/googleAuth/googleAuth.dto";
import { Public } from "@src/modules/auth/public.decorator";

@ApiTags("Auth")
@Public()
@Controller("auth")
export class GoogleAuthController {
  constructor(private readonly googleAuthUseCase: GoogleAuthUseCase) {}

  @Post("google")
  @ApiOperation({
    summary: "Connexion / inscription via Google",
    description:
      "Vérifie le token Google. Si l'utilisateur existe, connexion directe. " +
      "Sinon, retourne needsRegistration ou crée le compte si le rôle est fourni.",
  })
  @ApiResponse({
    status: 200,
    description:
      "Connexion réussie ou needsRegistration si l'utilisateur n'existe pas.",
  })
  @ApiResponse({ status: 401, description: "Token Google invalide." })
  googleAuth(@Body() dto: GoogleAuthDto) {
    return this.googleAuthUseCase.execute(dto);
  }
}
