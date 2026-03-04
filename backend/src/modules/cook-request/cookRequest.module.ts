import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CookRequestEntity,
      Cook,
      Client,
      Conversation,
      ConversationParticipant,
    ]),
  ],
  controllers: [
    CreateCookRequestController,
    GetClientCookRequestsController,
    GetCookCookRequestsController,
    GetCookRequestController,
    AcceptCookRequestController,
    RefuseCookRequestController,
    CancelCookRequestController,
    GetCookRequestPriceController,
  ],
  providers: [
    CreateCookRequestUseCase,
    GetCookRequestUseCase,
    GetClientCookRequestsUseCase,
    AcceptCookRequestUseCase,
    RefuseCookRequestUseCase,
    CancelCookRequestUseCase,
    GetCookCookRequestsUseCase,
    GetCookRequestPriceUseCase,
  ],
})
export class CookRequestModule {}
