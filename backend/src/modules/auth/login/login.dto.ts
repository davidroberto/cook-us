import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "jean@test.fr" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  password: string;

  @ApiPropertyOptional({ example: "ExponentPushToken[xxxxxx]" })
  @IsOptional()
  @IsString()
  expoPushToken?: string;
}
