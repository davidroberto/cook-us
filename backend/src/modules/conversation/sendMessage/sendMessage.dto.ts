import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
  @ApiProperty({
    description: "Contenu du message",
    example: "Bonjour, je suis intéressé par vos services !",
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
