import {
  BadRequestException,
  ConflictException,
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
import { CreateReviewDto } from "@src/modules/cook-request/createReview/createReview.dto";
import { Review } from "@src/modules/cook-request/review.entity";
import { Repository } from "typeorm";

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @InjectRepository(CookRequestEntity)
    private readonly cookRequestRepository: Repository<CookRequestEntity>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async execute(
    cookRequestId: number,
    currentUserId: number,
    dto: CreateReviewDto
  ): Promise<Review> {
    const cookRequest = await this.cookRequestRepository.findOne({
      where: { id: cookRequestId },
    });

    if (!cookRequest) {
      throw new NotFoundException(
        `La réservation #${cookRequestId} n'existe pas`
      );
    }

    const client = await this.clientRepository.findOne({
      where: { userId: currentUserId },
    });

    if (!client || cookRequest.clientId !== client.id) {
      throw new ForbiddenException(
        `Vous n'êtes pas autorisé à laisser un avis pour cette réservation`
      );
    }

    if (cookRequest.status !== CookRequestStatus.COMPLETED) {
      throw new BadRequestException(
        `Impossible de laisser un avis pour une réservation avec le statut "${cookRequest.status}"`
      );
    }

    const existing = await this.reviewRepository.findOne({
      where: { cookRequestId },
    });

    if (existing) {
      throw new ConflictException(`Un avis existe déjà pour cette prestation`);
    }

    const review = this.reviewRepository.create({
      rating: dto.rating,
      comment: dto.comment ?? null,
      clientId: client.id,
      cookId: cookRequest.cookId,
      cookRequestId,
    });

    return this.reviewRepository.save(review);
  }
}
