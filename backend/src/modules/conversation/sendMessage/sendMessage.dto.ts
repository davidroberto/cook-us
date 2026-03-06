import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SendMessageDto {
  @ApiPropertyOptional({
    description: "Contenu textuel du message",
    example: "Bonjour, je suis intéressé par vos services !",
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: "URL de l'image jointe au message",
    example: "/api/uploads/1234567890-image.jpg",
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
