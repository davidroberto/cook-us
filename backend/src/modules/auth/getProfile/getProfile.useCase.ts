import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Client } from "@src/modules/client/client.entity";

@Injectable()
export class GetProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    let address: {
      street: string | null;
      postalCode: string | null;
      city: string | null;
    } | null = null;

    if (user.role === UserRole.CLIENT) {
      const client = await this.clientRepository.findOne({ where: { userId } });
      if (client) {
        address = {
          street: client.street ?? null,
          postalCode: client.postalCode ?? null,
          city: client.city ?? null,
        };
      }
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      thumbnail: user.thumbnail ?? null,
      address,
    };
  }
}
