import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { Repository } from "typeorm";

@Injectable()
export class GetCookUseCase {
  constructor(
    @InjectRepository(Cook)
    private readonly cookRepository: Repository<Cook>
  ) {}

  async execute(id: string) {
    const cook = await this.cookRepository.findOne({
      where: { id },
      relations: {
        user: true,
        images: true,
        reviews: { client: { user: true } },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        description: true,
        speciality: true,
        hourlyRate: true,
        isActive: true,
        isValidated: true,
        city: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          thumbnail: true,
          role: true,
        },
        images: {
          id: true,
          imgUrl: true,
          description: true,
        },
        reviews: {
          id: true,
          rating: true,
          comment: true,
          createdAt: true,
          client: { id: true, user: { firstName: true } },
        },
      },
    });

    if (!cook) {
      throw new NotFoundException(`Cook ${id} not found`);
    }

    const reviews = (cook.reviews ?? [])
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        clientFirstName: r.client?.user?.firstName ?? "Client",
      }));

    const averageRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
              10
          ) / 10
        : null;

    return { ...cook, reviews, averageRating };
  }
}
