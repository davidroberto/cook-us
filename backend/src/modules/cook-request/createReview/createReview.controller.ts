import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Roles } from "@src/modules/auth/roles.decorator";
import { CreateReviewDto } from "@src/modules/cook-request/createReview/createReview.dto";
import { CreateReviewUseCase } from "@src/modules/cook-request/createReview/createReview.useCase";
import { Review } from "@src/modules/cook-request/review.entity";
import { UserRole } from "@src/modules/user/user.entity";

@ApiTags("Cook Request")
@ApiBearerAuth()
@Controller("cook-request")
@Roles(UserRole.CLIENT, UserRole.ADMIN)
export class CreateReviewController {
  constructor(private readonly createReviewUseCase: CreateReviewUseCase) {}

  @Post(":id/review")
  @ApiOperation({ summary: "Laisser un avis sur une prestation (client)" })
  @ApiResponse({
    status: 201,
    description: "Avis créé avec succès",
    type: Review,
  })
  @ApiResponse({ status: 400, description: "Réservation non complétée" })
  @ApiResponse({ status: 403, description: "Non autorisé" })
  @ApiResponse({ status: 404, description: "Réservation introuvable" })
  @ApiResponse({
    status: 409,
    description: "Un avis existe déjà pour cette prestation",
  })
  create(
    @Param("id", ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateReviewDto
  ) {
    return this.createReviewUseCase.execute(id, req.user.id, dto);
  }
}
