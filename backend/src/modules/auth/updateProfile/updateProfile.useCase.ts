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

    let address: { street: string; postalCode: string; city: string } | null =
      null;

    if (user.role === UserRole.CLIENT) {
      const client = await this.clientRepository.findOne({ where: { userId } });
      if (
        client &&
        (dto.street !== undefined ||
          dto.postalCode !== undefined ||
          dto.city !== undefined)
      ) {
        if (dto.street !== undefined) client.street = dto.street || null;
        if (dto.postalCode !== undefined)
          client.postalCode = dto.postalCode || null;
        if (dto.city !== undefined) client.city = dto.city || null;
        await this.clientRepository.save(client);
      }
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
