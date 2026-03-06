import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { MealType } from "@src/modules/cook-request/cookRequest.entity";

export class CreateCookRequestDto {
  @ApiProperty({ description: "Nombre d'invités", example: 4, minimum: 1 })
  @IsInt()
  @Min(1)
  guestsNumber: number;

  @ApiProperty({
    description: "Date de début de la prestation",
    example: "2026-03-15T18:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({
    description: "Date de fin de la prestation",
    example: "2026-03-15T22:00:00.000Z",
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: "Identifiant du cuisinier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  cookId: string;

  @ApiPropertyOptional({
    description:
      "Identifiant du client (déduit automatiquement du token JWT si non fourni)",
    example: 1,
  })
  @IsOptional()
  @IsInt()
  clientId?: number;

  @ApiProperty({
    description: "Type de repas",
    enum: MealType,
    example: MealType.DINNER,
  })
  @IsEnum(MealType)
  mealType: MealType;

  @ApiPropertyOptional({
    description: "Message du client au cuisinier",
    example: "Bonjour, je souhaite un menu végétarien pour 4 personnes.",
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: "Rue de la prestation",
    example: "12 rue de la Paix",
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({
    description: "Code postal de la prestation",
    example: "75001",
  })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({
    description: "Ville de la prestation",
    example: "Paris",
  })
  @IsOptional()
  @IsString()
  city?: string;
}
