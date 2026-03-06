import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { CookUnavailability } from "@src/modules/cook/cookUnavailability.entity";
import { CookRequestEntity, CookRequestStatus } from "@src/modules/cook-request/cookRequest.entity";

@Injectable()
export class CookCalendarUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
    @InjectRepository(CookUnavailability)
    private readonly unavailabilityRepository: Repository<CookUnavailability>,
    @InjectRepository(CookRequestEntity)
    private readonly requestRepository: Repository<CookRequestEntity>
  ) {}

  private async findCookByUserId(userId: number): Promise<Cook> {
    const cook = await this.cookRepository.findOne({ where: { userId } });
    if (!cook) throw new NotFoundException("Profil cuisinier introuvable.");
    return cook;
  }

  async getCalendar(userId: number, year: number, month: number) {
    const cook = await this.findCookByUserId(userId);

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    const [requests, unavailabilities] = await Promise.all([
      this.requestRepository.find({
        where: {
          cookId: cook.id,
          startDate: Between(firstDay, lastDay),
        },
        select: { id: true, startDate: true, status: true },
      }),
      this.unavailabilityRepository.find({
        where: { cookId: cook.id },
        select: { date: true },
      }),
    ]);

    const activeRequests = requests
      .filter((r) =>
        [CookRequestStatus.PENDING, CookRequestStatus.ACCEPTED].includes(
          r.status
        )
      )
      .map((r) => ({
        id: r.id,
        date: r.startDate.toISOString().slice(0, 10),
        status: r.status,
      }));

    const monthPrefix = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
    const blockedDates = unavailabilities
      .filter((u) => u.date.startsWith(monthPrefix))
      .map((u) => u.date);

    return { requests: activeRequests, blockedDates };
  }

  async blockDate(userId: number, date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException("Format de date invalide (attendu : YYYY-MM-DD).");
    }
    const cook = await this.findCookByUserId(userId);

    const existing = await this.unavailabilityRepository.findOne({
      where: { cookId: cook.id, date },
    });
    if (existing) return existing;

    const unavailability = this.unavailabilityRepository.create({
      cookId: cook.id,
      date,
    });
    return this.unavailabilityRepository.save(unavailability);
  }

  async unblockDate(userId: number, date: string) {
    const cook = await this.findCookByUserId(userId);
    await this.unavailabilityRepository.delete({ cookId: cook.id, date });
    return { success: true };
  }

  async getPublicUnavailabilities(cookId: string) {
    const today = new Date().toISOString().slice(0, 10);
    const unavailabilities = await this.unavailabilityRepository.find({
      where: { cookId },
      select: { date: true },
    });
    const blockedDates = unavailabilities
      .map((u) => u.date)
      .filter((d) => d >= today);
    return { blockedDates };
  }
}
