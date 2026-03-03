import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CancelCookRequestDto {
  @ApiProperty({
    description: "Motif d'annulation de la réservation",
    example: "Je ne suis plus disponible à cette date",
  })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
