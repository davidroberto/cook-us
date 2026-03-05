import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "@src/modules/user/user.entity";

@Injectable()
export class RegisterPushTokenUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async execute(userId: number, expoPushToken: string): Promise<void> {
    await this.userRepository.update(userId, { expoPushToken });
  }
}
