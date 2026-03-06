import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CookCalendarUseCase } from "./cookCalendar.useCase";

class BlockDateDto {
  @ApiProperty({ example: "2026-03-15" })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "Format de date invalide (attendu : YYYY-MM-DD)" })
  date: string;
}

@ApiTags("Cook")
@Roles(UserRole.COOK)
@Controller("cook")
export class CookCalendarController {
  constructor(private readonly useCase: CookCalendarUseCase) {}

  @Get("me/calendar")
  @ApiOperation({ summary: "Calendrier du cuisinier (réservations + dates bloquées)" })
  @ApiQuery({ name: "year", required: true, example: 2026 })
  @ApiQuery({ name: "month", required: true, example: 3 })
  getCalendar(
    @Request() req: { user: { id: number } },
    @Query("year") year: string,
    @Query("month") month: string
  ) {
    return this.useCase.getCalendar(
      req.user.id,
      parseInt(year, 10),
      parseInt(month, 10)
    );
  }

  @Post("me/unavailabilities")
  @ApiOperation({ summary: "Bloquer une date" })
  blockDate(
    @Request() req: { user: { id: number } },
    @Body() dto: BlockDateDto
  ) {
    return this.useCase.blockDate(req.user.id, dto.date);
  }

  @Delete("me/unavailabilities/:date")
  @ApiOperation({ summary: "Débloquer une date" })
  unblockDate(
    @Request() req: { user: { id: number } },
    @Param("date") date: string
  ) {
    return this.useCase.unblockDate(req.user.id, date);
  }
}
