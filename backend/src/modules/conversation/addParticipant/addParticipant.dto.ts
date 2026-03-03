import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class AddParticipantDto {
  @ApiProperty({
    description: "ID de l'utilisateur à ajouter",
    example: 3,
  })
  @IsInt()
  userId: number;
}
