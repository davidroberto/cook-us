import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { CookUnavailability } from "@src/modules/cook/cookUnavailability.entity";
import { User } from "@src/modules/user/user.entity";
import { PayCookRequestController } from "@src/modules/cook-request/payCookRequest/payCookRequest.controller";
import { PayCookRequestUseCase } from "@src/modules/cook-request/payCookRequest/payCookRequest.useCase";
import { CreateCookRequestController } from "@src/modules/cook-request/createCookRequest/createCookRequest.controller";
import { CreateCookRequestUseCase } from "@src/modules/cook-request/createCookRequest/createCookRequest.useCase";
import { GetCookRequestController } from "@src/modules/cook-request/getCookRequest/getCookRequest.controller";
import { GetCookRequestUseCase } from "@src/modules/cook-request/getCookRequest/getCookRequest.useCase";
import { CancelCookRequestController } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.controller";
import { CancelCookRequestUseCase } from "@src/modules/cook-request/cancelCookRequest/cancelCookRequest.useCase";
import { GetClientCookRequestsController } from "@src/modules/cook-request/getClientCookRequests/getClientCookRequests.controller";
import { GetClientCookRequestsUseCase } from "@src/modules/cook-request/getClientCookRequests/getClientCookRequests.useCase";
import { AcceptCookRequestController } from "@src/modules/cook-request/acceptCookRequest/acceptCookRequest.controller";
import { AcceptCookRequestUseCase } from "@src/modules/cook-request/acceptCookRequest/acceptCookRequest.useCase";
import { RefuseCookRequestController } from "@src/modules/cook-request/refuseCookRequest/refuseCookRequest.controller";
import { RefuseCookRequestUseCase } from "@src/modules/cook-request/refuseCookRequest/refuseCookRequest.useCase";
import { GetCookCookRequestsController } from "@src/modules/cook-request/getCookCookRequests/getCookCookRequests.controller";
import { GetCookCookRequestsUseCase } from "@src/modules/cook-request/getCookCookRequests/getCookCookRequests.useCase";
import { GetCookRequestPriceController } from "@src/modules/cook-request/getCookRequestPrice/getCookRequestPrice.controller";
import { GetCookRequestPriceUseCase } from "@src/modules/cook-request/getCookRequestPrice/getCookRequestPrice.useCase";
import { GetCookRequestsByConversationController } from "@src/modules/cook-request/getCookRequestsByConversation/getCookRequestsByConversation.controller";
import { GetCookRequestsByConversationUseCase } from "@src/modules/cook-request/getCookRequestsByConversation/getCookRequestsByConversation.useCase";
import { CompleteCookRequestController } from "@src/modules/cook-request/completeCookRequest/completeCookRequest.controller";
import { CompleteCookRequestUseCase } from "@src/modules/cook-request/completeCookRequest/completeCookRequest.useCase";
import { CreateReviewController } from "@src/modules/cook-request/createReview/createReview.controller";
import { CreateReviewUseCase } from "@src/modules/cook-request/createReview/createReview.useCase";
import { Review } from "@src/modules/cook-request/review.entity";
import { UpdateCookRequestAddressController } from "@src/modules/cook-request/updateCookRequestAddress/updateCookRequestAddress.controller";
import { UpdateCookRequestAddressUseCase } from "@src/modules/cook-request/updateCookRequestAddress/updateCookRequestAddress.useCase";
import { UpdateCookRequestPriceController } from "@src/modules/cook-request/updateCookRequestPrice/updateCookRequestPrice.controller";
import { UpdateCookRequestPriceUseCase } from "@src/modules/cook-request/updateCookRequestPrice/updateCookRequestPrice.useCase";
import { NotificationModule } from "@src/modules/notification/notification.module";
import { ConversationModule } from "@src/modules/conversation/conversation.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CookRequestEntity,
      Cook,
      Client,
      Conversation,
      ConversationParticipant,
      Message,
      CookUnavailability,
      User,
      Review,
    ]),
    NotificationModule,
    ConversationModule,
  ],
  controllers: [
    CreateCookRequestController,
    GetClientCookRequestsController,
    GetCookCookRequestsController,
    GetCookRequestController,
    AcceptCookRequestController,
    RefuseCookRequestController,
    CancelCookRequestController,
    PayCookRequestController,
    GetCookRequestPriceController,
    GetCookRequestsByConversationController,
    CompleteCookRequestController,
    CreateReviewController,
    UpdateCookRequestAddressController,
    UpdateCookRequestPriceController,
  ],
  providers: [
    CreateCookRequestUseCase,
    GetCookRequestUseCase,
    GetClientCookRequestsUseCase,
    AcceptCookRequestUseCase,
    RefuseCookRequestUseCase,
    CancelCookRequestUseCase,
    GetCookCookRequestsUseCase,
    PayCookRequestUseCase,
    GetCookRequestPriceUseCase,
    GetCookRequestsByConversationUseCase,
    CompleteCookRequestUseCase,
    CreateReviewUseCase,
    UpdateCookRequestAddressUseCase,
    UpdateCookRequestPriceUseCase,
  ],
})
export class CookRequestModule {}
