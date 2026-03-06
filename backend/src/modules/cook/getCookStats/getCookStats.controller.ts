import { Controller, Get, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import {
  GetCookStatsUseCase,
  StatPeriod,
} from "@src/modules/cook/getCookStats/getCookStats.useCase";

@ApiTags("Cook")
@ApiBearerAuth()
@Controller("cook")
@Roles(UserRole.COOK)
export class GetCookStatsController {
  constructor(private readonly getCookStatsUseCase: GetCookStatsUseCase) {}

  @Get("stats")
  @ApiOperation({ summary: "Statistiques du tableau de bord cuisinier" })
  @ApiQuery({ name: "period", enum: ["1m", "3m", "6m", "1y"], required: false })
  getStats(
    @Request() req: { user: { id: number } },
    @Query("period") period?: string
  ) {
    return this.getCookStatsUseCase.execute(req.user.id, period as StatPeriod);
  }
}
