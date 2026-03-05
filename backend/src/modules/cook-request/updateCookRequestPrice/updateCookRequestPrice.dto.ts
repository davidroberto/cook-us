import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class UpdateCookRequestPriceDto {
  @ApiProperty({
    description: "Nouveau prix proposé par le cuisinier (€)",
    example: 150,
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
