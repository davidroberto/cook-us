import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from "class-validator";

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

  @ApiProperty({
    description: "Date de fin de la prestation",
    example: "2026-03-15T22:00:00.000Z",
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: "Identifiant du cuisinier",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  cookId: string;

  @ApiProperty({ description: "Identifiant du client", example: 1 })
  @IsInt()
  clientId: number;
}
