import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { UserRole } from "@src/modules/user/user.entity";
import { GetDashboardStatsUseCase } from "./getDashboardStats.useCase";

@ApiTags("Backoffice")
@Roles(UserRole.ADMIN)
@Controller("backoffice")
export class GetDashboardStatsController {
  constructor(private readonly useCase: GetDashboardStatsUseCase) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Statistiques KPI du dashboard admin" })
  @ApiQuery({
    name: "period",
    required: false,
    description: "Période en jours (défaut: 30, max: 365)",
  })
  getDashboard(@Query("period") period?: string) {
    const periodDays = Math.min(
      Math.max(parseInt(period ?? "30", 10) || 30, 1),
      365
    );
    return this.useCase.execute(periodDays);
  }
}
