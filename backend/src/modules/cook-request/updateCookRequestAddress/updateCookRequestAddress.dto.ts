import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCookRequestAddressDto {
  @ApiProperty({ example: "12 rue de la Paix" })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: "75001" })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: "Paris" })
  @IsString()
  @IsNotEmpty()
  city: string;
}
