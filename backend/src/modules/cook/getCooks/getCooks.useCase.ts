import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { GetCooksQueryDto } from "@src/modules/cook/getCooks/getCooks.dto";

@Injectable()
export class GetCooksUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  execute(query: GetCooksQueryDto = {}) {
    const { speciality, minHourlyRate, maxHourlyRate, city, search } = query;

    const qb = this.cookRepository
      .createQueryBuilder("cook")
      .leftJoinAndSelect("cook.user", "user")
      .leftJoinAndSelect("cook.images", "images")
      .select([
        "cook.id",
        "cook.firstName",
        "cook.lastName",
        "cook.photoUrl",
        "cook.description",
        "cook.speciality",
        "cook.hourlyRate",
        "cook.isActive",
        "cook.isValidated",
        "cook.city",
        "user.id",
        "user.firstName",
        "user.lastName",
        "user.email",
        "user.thumbnail",
        "user.role",
        "images.id",
        "images.imgUrl",
        "images.description",
      ]);

    qb.andWhere("cook.isValidated = true").andWhere("cook.isActive = true");

    if (speciality) {
      qb.andWhere("LOWER(cook.speciality) LIKE LOWER(:speciality)", {
        speciality: `%${speciality}%`,
      });
    }

    if (minHourlyRate !== undefined) {
      qb.andWhere("cook.hourlyRate >= :minHourlyRate", { minHourlyRate });
    }

    if (maxHourlyRate !== undefined) {
      qb.andWhere("cook.hourlyRate <= :maxHourlyRate", { maxHourlyRate });
    }

    if (city) {
      qb.andWhere("LOWER(cook.city) LIKE LOWER(:city)", {
        city: `%${city}%`,
      });
    }

    if (search) {
      qb.andWhere(
        "(LOWER(cook.firstName) LIKE LOWER(:search) OR LOWER(cook.lastName) LIKE LOWER(:search) OR LOWER(CONCAT(cook.firstName, ' ', cook.lastName)) LIKE LOWER(:search))",
        { search: `%${search}%` }
      );
    }

    return qb.getMany();
  }
}
