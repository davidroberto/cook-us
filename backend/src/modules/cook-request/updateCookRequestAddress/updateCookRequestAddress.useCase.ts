import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "@src/modules/client/client.entity";
import {
  CookRequestEntity,
  CookRequestStatus,
} from "@src/modules/cook-request/cookRequest.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { Like, Repository } from "typeorm";
import { UpdateCookRequestAddressDto } from "./updateCookRequestAddress.dto";

const NON_EDITABLE_STATUSES = [
  CookRequestStatus.PAID,
  CookRequestStatus.COMPLETED,
];

const COOK_REQUEST_MESSAGE_PREFIX = "__COOK_REQUEST__";

@Injectable()
export class UpdateCookRequestAddressUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>
  ) {}

  async execute(id: number, dto: UpdateCookRequestAddressDto, userId: number) {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id },
    });
    if (!cookRequest) {
      throw new NotFoundException("Demande introuvable.");
    }

    const client = await this.clientRepository.findOne({ where: { userId } });
    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        "Vous n'êtes pas autorisé à modifier cette demande."
      );
    }

    if (NON_EDITABLE_STATUSES.includes(cookRequest.status)) {
      throw new BadRequestException(
        "L'adresse ne peut pas être modifiée une fois la prestation payée ou terminée."
      );
    }

    cookRequest.street = dto.street;
    cookRequest.postalCode = dto.postalCode;
    cookRequest.city = dto.city;

    await this.cookRequestRepository.save(cookRequest);

    if (cookRequest.conversationId) {
      const messages = await this.messageRepository.find({
        where: {
          conversationId: cookRequest.conversationId,
          message: Like(`${COOK_REQUEST_MESSAGE_PREFIX}%`),
        },
      });

      let updated = false;
      for (const msg of messages) {
        try {
          const payload = JSON.parse(
            msg.message.slice(COOK_REQUEST_MESSAGE_PREFIX.length)
          );

          // Convert both to numbers for comparison (in case cookRequestId is stored as string)
          if (Number(payload.cookRequestId) === Number(cookRequest.id)) {
            payload.street = dto.street;
            payload.postalCode = dto.postalCode;
            payload.city = dto.city;
            msg.message = COOK_REQUEST_MESSAGE_PREFIX + JSON.stringify(payload);
            await this.messageRepository.save(msg);
            updated = true;
            break;
          }
        } catch (err) {
          // skip malformed messages
        }
      }
    }

    return {
      id: cookRequest.id,
      street: cookRequest.street,
      postalCode: cookRequest.postalCode,
      city: cookRequest.city,
    };
  }
}
