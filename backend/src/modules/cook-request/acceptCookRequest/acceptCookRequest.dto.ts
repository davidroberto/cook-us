import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class AcceptCookRequestDto {
  @ApiProperty({
    description: "Prix proposé par le cuisinier (€)",
    example: 120,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
