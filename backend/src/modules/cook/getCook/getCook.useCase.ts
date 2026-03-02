import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCookUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
  ) {}

  async execute(id: string) {
    const cook = await this.cookRepository.findOne({
      where: { id },
      relations: { user: true, images: true },
    });

    if (!cook) {
      throw new NotFoundException(`Cook ${id} not found`);
    }

    return cook;
  }
}
