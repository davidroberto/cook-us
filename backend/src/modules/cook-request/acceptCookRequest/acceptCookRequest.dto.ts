import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class AcceptCookRequestDto {
  @ApiProperty({ example: 150, description: "Prix de la prestation (en €)" })
  @IsNumber()
  @Min(0.01)
  price: number;
}
