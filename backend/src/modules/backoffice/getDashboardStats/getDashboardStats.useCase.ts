import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
  MealType,
} from "@src/modules/cook-request/cookRequest.entity";

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Cook)
    private readonly cookRepo: Repository<Cook>,
    @InjectRepository(CookRequestEntity)
    private readonly requestRepo: Repository<CookRequestEntity>
  ) {}

  async execute(periodDays: number) {
    const since = new Date();
    since.setDate(since.getDate() - periodDays);

    // ── Users ──────────────────────────────────────────────────────────────────
    const allUsers = await this.userRepo.find();
    const clientUsers = allUsers.filter((u) => u.role === UserRole.CLIENT);
    const cookUsers = allUsers.filter((u) => u.role === UserRole.COOK);
    const adminUsers = allUsers.filter((u) => u.role === UserRole.ADMIN);
    const newUsersInPeriod = allUsers.filter((u) => u.createdAt >= since);
    const userEvolution = this.groupByDay(
      newUsersInPeriod.map((u) => u.createdAt),
      periodDays
    );

    // ── Bookings ───────────────────────────────────────────────────────────────
    const allBookings = await this.requestRepo.find({
      relations: { cook: true },
    });
    const bookingsInPeriod = allBookings.filter((r) => r.startDate >= since);

    const byStatus: Record<string, number> = {};
    for (const s of Object.values(CookRequestStatus)) {
      byStatus[s] = allBookings.filter((r) => r.status === s).length;
    }

    const byMealType: Record<string, number> = {};
    for (const m of Object.values(MealType)) {
      byMealType[m] = allBookings.filter((r) => r.mealType === m).length;
    }

    const bookingEvolution = this.groupByDay(
      bookingsInPeriod.map((r) => r.startDate),
      periodDays
    );

    // ── Revenue (commissions estimées sur réservations terminées) ──────────────
    const COMMISSION_RATE = 0.15;
    const DEFAULT_HOURLY_RATE = 30;
    const DEFAULT_DURATION_HOURS = 3;

    const completedBookings = allBookings.filter(
      (r) => r.status === CookRequestStatus.COMPLETED
    );
    const completedInPeriod = completedBookings.filter(
      (r) => r.startDate >= since
    );

    const computeRevenue = (bookings: CookRequestEntity[]) =>
      bookings.reduce((sum, r) => {
        const rate = Number(r.cook?.hourlyRate ?? DEFAULT_HOURLY_RATE);
        return sum + rate * DEFAULT_DURATION_HOURS * COMMISSION_RATE;
      }, 0);

    const revenueEvolution = this.groupByDayRevenue(
      completedInPeriod,
      periodDays,
      DEFAULT_HOURLY_RATE,
      DEFAULT_DURATION_HOURS,
      COMMISSION_RATE
    );

    // ── Cooks ──────────────────────────────────────────────────────────────────
    const allCooks = await this.cookRepo.find();
    const bySpeciality: Record<string, number> = {};
    const byValidationStatus: Record<string, number> = {};
    for (const cook of allCooks) {
      bySpeciality[cook.speciality] = (bySpeciality[cook.speciality] ?? 0) + 1;
      byValidationStatus[cook.validationStatus] =
        (byValidationStatus[cook.validationStatus] ?? 0) + 1;
    }

    return {
      period: periodDays,
      users: {
        total: allUsers.length,
        byRole: {
          clients: clientUsers.length,
          cooks: cookUsers.length,
          admins: adminUsers.length,
        },
        newInPeriod: newUsersInPeriod.length,
        evolution: userEvolution,
      },
      bookings: {
        total: allBookings.length,
        inPeriod: bookingsInPeriod.length,
        byStatus,
        byMealType,
        evolution: bookingEvolution,
      },
      revenue: {
        totalEstimated: Math.round(computeRevenue(completedBookings)),
        inPeriodEstimated: Math.round(computeRevenue(completedInPeriod)),
        commissionRate: COMMISSION_RATE,
        evolution: revenueEvolution,
      },
      cooks: {
        bySpeciality,
        byValidationStatus,
      },
    };
  }

  private groupByDay(
    dates: Date[],
    periodDays: number
  ): Array<{ date: string; count: number }> {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = periodDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }
    for (const date of dates) {
      const key = date.toISOString().slice(0, 10);
      if (map.has(key)) {
        map.set(key, (map.get(key) ?? 0) + 1);
      }
    }
    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  }

  private groupByDayRevenue(
    bookings: CookRequestEntity[],
    periodDays: number,
    defaultRate: number,
    defaultDuration: number,
    commissionRate: number
  ): Array<{ date: string; amount: number }> {
    const map = new Map<string, number>();
    const now = new Date();
    for (let i = periodDays - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map.set(d.toISOString().slice(0, 10), 0);
    }
    for (const r of bookings) {
      const key = r.startDate.toISOString().slice(0, 10);
      if (map.has(key)) {
        const rate = Number(r.cook?.hourlyRate ?? defaultRate);
        map.set(
          key,
          (map.get(key) ?? 0) + rate * defaultDuration * commissionRate
        );
      }
    }
    return Array.from(map.entries()).map(([date, amount]) => ({
      date,
      amount: Math.round(amount * 100) / 100,
    }));
  }
}
