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

    let address: { street: string; postalCode: string; city: string } | null =
      null;

    if (user.role === UserRole.CLIENT) {
      const client = await this.clientRepository.findOne({ where: { userId } });
      if (client?.street && client?.postalCode && client?.city) {
        address = {
          street: client.street,
          postalCode: client.postalCode,
          city: client.city,
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
      ...(user.role === UserRole.CLIENT ? { address } : {}),
    };
  }
}
