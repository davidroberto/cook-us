import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UserRole } from "@src/modules/user/user.entity";
import { RegisterCookProfileDto } from "@src/modules/auth/register/register.dto";

export class GoogleAuthDto {
  @ApiProperty({
    example: "eyJhbGciOiJSUzI1NiIs...",
    description: "Google ID token from expo-auth-session",
  })
  @IsString()
  idToken: string;

  @ApiPropertyOptional({
    enum: [UserRole.COOK, UserRole.CLIENT],
    description:
      "Role for new user registration. Omit on first call to check if user exists.",
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.COOK | UserRole.CLIENT;

  @ApiPropertyOptional({
    type: RegisterCookProfileDto,
    description: "Required if role is cook.",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterCookProfileDto)
  cookProfile?: RegisterCookProfileDto;

  @ApiPropertyOptional({ example: "ExponentPushToken[xxxxxx]" })
  @IsOptional()
  @IsString()
  expoPushToken?: string;
}
