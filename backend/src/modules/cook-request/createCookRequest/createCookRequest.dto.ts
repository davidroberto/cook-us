import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from "class-validator";

export class CreateCookRequestDto {
  @IsInt()
  @Min(1)
  guestsNumber: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  cookId: string;

  @IsInt()
  clientId: number;
}
