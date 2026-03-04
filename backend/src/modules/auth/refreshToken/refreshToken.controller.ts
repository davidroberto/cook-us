import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RefreshTokenUseCase } from "@src/modules/auth/refreshToken/refreshToken.useCase";
import { RefreshTokenDto } from "@src/modules/auth/refreshToken/refreshToken.dto";
import { Public } from "@src/modules/auth/public.decorator";

@ApiTags("Auth")
@Public()
@Controller("auth")
export class RefreshTokenController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post("refresh")
  @ApiOperation({
    summary: "Rafraîchir le token",
    description:
      "Envoie le refresh token pour obtenir un nouveau access token et un nouveau refresh token (rotation).",
  })
  @ApiResponse({
    status: 200,
    description:
      "Tokens rafraîchis. Retourne un nouveau token JWT et un nouveau refresh token.",
  })
  @ApiResponse({
    status: 401,
    description: "Refresh token invalide ou expiré.",
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.refreshTokenUseCase.execute(dto);
  }
}
