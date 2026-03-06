import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CookRequestEntity,
  CookRequestStatus,
  MealType,
} from "@src/modules/cook-request/cookRequest.entity";
import { Review } from "@src/modules/cook-request/review.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Repository } from "typeorm";

export type StatPeriod = "1m" | "3m" | "6m" | "1y";

const PERIOD_MONTHS: Record<StatPeriod, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "1y": 12,
};

@Injectable()
export class GetCookStatsUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  async execute(userId: number, period: StatPeriod = "3m") {
    const cook = await this.cookRepository.findOne({ where: { userId } });
    if (!cook) throw new NotFoundException("Cuisinier introuvable");

    const months = PERIOD_MONTHS[period] ?? 3;
    const now = new Date();
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - months);

    const requests = await this.cookRequestRepository
      .createQueryBuilder("r")
      .where("r.cookId = :cookId", { cookId: cook.id })
      .andWhere("r.startDate >= :from", { from: threeMonthsAgo })
      .getMany();

    const completed = requests.filter(
      (r) => r.status === CookRequestStatus.COMPLETED
    );

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const completedThisWeek = completed.filter(
      (r) => r.startDate >= weekStart
    ).length;
    const completedThisMonth = completed.filter(
      (r) => r.startDate >= monthStart
    ).length;

    const relevant = requests.filter((r) =>
      [
        CookRequestStatus.COMPLETED,
        CookRequestStatus.REFUSED,
        CookRequestStatus.CANCELLED,
      ].includes(r.status)
    );
    const acceptanceRate =
      relevant.length > 0
        ? Math.round((completed.length / relevant.length) * 100)
        : null;

    const averageGuestsNumber =
      completed.length > 0
        ? Math.round(
            (completed.reduce((sum, r) => sum + r.guestsNumber, 0) /
              completed.length) *
              10
          ) / 10
        : null;

    const mealTypeDistribution = {
      [MealType.BREAKFAST]: 0,
      [MealType.LUNCH]: 0,
      [MealType.DINNER]: 0,
    };
    for (const r of completed) {
      mealTypeDistribution[r.mealType]++;
    }

    const reviews = await this.reviewRepository.find({
      where: { cookId: cook.id },
    });
    const averageRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
              10
          ) / 10
        : null;

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    for (const r of reviews) {
      ratingDistribution[r.rating]++;
    }

    const granularity = period === "1m" ? "week" : "month";
    const evolution =
      granularity === "week"
        ? this.groupByWeek(completed, threeMonthsAgo, now)
        : this.groupByMonth(completed, threeMonthsAgo, now);

    return {
      period: { from: threeMonthsAgo.toISOString(), to: now.toISOString() },
      selectedPeriod: period,
      granularity,
      completedCount: {
        total: completed.length,
        thisWeek: completedThisWeek,
        thisMonth: completedThisMonth,
      },
      evolution,
      acceptanceRate,
      averageGuestsNumber,
      mealTypeDistribution,
      averageRating,
      ratingDistribution,
    };
  }

  private groupByMonth(
    requests: CookRequestEntity[],
    from: Date,
    to: Date
  ): Array<{ period: string; count: number }> {
    const result: Array<{ period: string; count: number }> = [];
    const current = new Date(from.getFullYear(), from.getMonth(), 1);

    while (current <= to) {
      const year = current.getFullYear();
      const month = current.getMonth();
      const period = `${year}-${String(month + 1).padStart(2, "0")}`;
      const count = requests.filter(
        (r) =>
          r.startDate.getFullYear() === year && r.startDate.getMonth() === month
      ).length;
      result.push({ period, count });
      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }

  private groupByWeek(
    requests: CookRequestEntity[],
    from: Date,
    to: Date
  ): Array<{ period: string; count: number }> {
    const result: Array<{ period: string; count: number }> = [];
    const current = new Date(from);
    current.setDate(current.getDate() - ((current.getDay() + 6) % 7));
    current.setHours(0, 0, 0, 0);

    while (current <= to) {
      const weekEnd = new Date(current);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const period = current.toISOString().substring(0, 10);
      const count = requests.filter(
        (r) => r.startDate >= current && r.startDate <= weekEnd
      ).length;
      result.push({ period, count });
      current.setDate(current.getDate() + 7);
    }

    return result;
  }
}
