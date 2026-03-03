import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, ArrayMinSize } from "class-validator";

export class CreateConversationDto {
  @ApiProperty({
    description: "Liste des IDs utilisateurs participants",
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  participantIds: number[];
}
