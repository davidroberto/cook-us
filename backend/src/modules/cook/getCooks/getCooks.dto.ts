
import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Type } from "class-transformer";

export class GetCooksQueryDto {
  @IsOptional()
  @IsString()
  speciality?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minHourlyRate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxHourlyRate?: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
