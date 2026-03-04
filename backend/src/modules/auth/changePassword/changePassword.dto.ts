import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({ example: "ancienMotDePasse" })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: "nouveauMotDePasse", minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
