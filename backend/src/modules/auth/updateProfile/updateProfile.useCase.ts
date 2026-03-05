import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User, UserRole } from "@src/modules/user/user.entity";
import { Client } from "@src/modules/client/client.entity";
import { UpdateProfileDto } from "@src/modules/auth/updateProfile/updateProfile.dto";

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(userId: number, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable.");
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: dto.email },
      });
      if (existing) {
        throw new BadRequestException("Cet email est déjà utilisé.");
      }
      user.email = dto.email;
    }

    if (dto.firstName) user.firstName = dto.firstName;
    if (dto.lastName) user.lastName = dto.lastName;
    if (dto.thumbnail) user.thumbnail = dto.thumbnail;

    await this.userRepository.save(user);

    let address: {
      street: string | null;
      postalCode: string | null;
      city: string | null;
    } | null = null;

    if (user.role === UserRole.CLIENT) {
      const client = await this.clientRepository.findOne({ where: { userId } });
      if (client) {
        if (dto.street !== undefined) client.street = dto.street;
        if (dto.postalCode !== undefined) client.postalCode = dto.postalCode;
        if (dto.city !== undefined) client.city = dto.city;
        await this.clientRepository.save(client);
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
