import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Injectable()
export class GetCooksUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>,
  ) {}

  execute() {
    return this.cookRepository.find({
      relations: { user: true, images: true },
    });
  }
}
