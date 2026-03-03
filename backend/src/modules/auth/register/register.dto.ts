import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { UserRole } from "@src/modules/user/user.entity";

export enum CookSpeciality {
  FRENCH = "french_cooking",
  ITALIAN = "italian_cooking",
  ASIAN = "asian_cooking",
  MEXICAN = "mexican_cooking",
  VEGETARIAN = "vegetarian_cooking",
  PASTRY = "pastry_cooking",
  JAPANESE = "japanese_cooking",
  INDIAN = "indian_cooking",
  OTHER = "autre",
}

export class RegisterCookProfileDto {
  @ApiProperty({ enum: CookSpeciality, example: CookSpeciality.ITALIAN })
  @IsEnum(CookSpeciality)
  speciality: CookSpeciality;

  @ApiPropertyOptional({
    example: "Passionné de pâtes fraîches depuis 10 ans.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 25.5, description: "Tarif horaire en euros" })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;
}

export class RegisterDto {
  @ApiProperty({ example: "Jean" })
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Dupont" })
  @IsString()
  lastName: string;

  @ApiProperty({ example: "jean@test.fr" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123" })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    enum: [UserRole.COOK, UserRole.CLIENT],
    default: UserRole.CLIENT,
    description: "Rôle de l'utilisateur. Par défaut : client.",
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole.COOK | UserRole.CLIENT;

  @ApiPropertyOptional({
    type: RegisterCookProfileDto,
    description: "Obligatoire si le rôle est cook.",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegisterCookProfileDto)
  cookProfile?: RegisterCookProfileDto;
}
