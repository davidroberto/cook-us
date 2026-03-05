import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { CookSpeciality } from "@src/modules/auth/register/register.dto";

export class UpdateCookProfileDto {
  @ApiPropertyOptional({ example: "Passionné de cuisine italienne depuis 10 ans." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: CookSpeciality })
  @IsOptional()
  @IsEnum(CookSpeciality)
  speciality?: CookSpeciality;

  @ApiPropertyOptional({ example: 30, description: "Tarif horaire en euros" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiPropertyOptional({ example: "Paris" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: "/api/uploads/avatar.jpg" })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
