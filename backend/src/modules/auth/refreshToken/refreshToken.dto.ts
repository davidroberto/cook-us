import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ description: "Le refresh token reçu lors du login" })
  @IsString()
  refreshToken: string;
}
