import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { Message } from "@src/modules/conversation/message.entity";
import { CreateConversationController } from "@src/modules/conversation/createConversation/createConversation.controller";
import { CreateConversationUseCase } from "@src/modules/conversation/createConversation/createConversation.useCase";
import { GetConversationsController } from "@src/modules/conversation/getConversations/getConversations.controller";
import { GetConversationsUseCase } from "@src/modules/conversation/getConversations/getConversations.useCase";
import { GetConversationController } from "@src/modules/conversation/getConversation/getConversation.controller";
import { GetConversationUseCase } from "@src/modules/conversation/getConversation/getConversation.useCase";
import { SendMessageController } from "@src/modules/conversation/sendMessage/sendMessage.controller";
import { SendMessageUseCase } from "@src/modules/conversation/sendMessage/sendMessage.useCase";
import { AddParticipantController } from "@src/modules/conversation/addParticipant/addParticipant.controller";
import { AddParticipantUseCase } from "@src/modules/conversation/addParticipant/addParticipant.useCase";
import { RemoveParticipantController } from "@src/modules/conversation/removeParticipant/removeParticipant.controller";
import { RemoveParticipantUseCase } from "@src/modules/conversation/removeParticipant/removeParticipant.useCase";
import { GetMyConversationsController } from "@src/modules/conversation/getMyConversations/getMyConversations.controller";
import { GetMyConversationsUseCase } from "@src/modules/conversation/getMyConversations/getMyConversations.useCase";
import { GetConversationMessagesController } from "@src/modules/conversation/getConversationMessages/getConversationMessages.controller";
import { GetConversationMessagesUseCase } from "@src/modules/conversation/getConversationMessages/getConversationMessages.useCase";
import { ConversationParticipantGuard } from "@src/modules/conversation/conversationParticipant.guard";
import { ChatGateway } from "@src/modules/conversation/chat.gateway";
import { AuthModule } from "@src/modules/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, ConversationParticipant, Message]),
    AuthModule,
  ],
  controllers: [
    CreateConversationController,
    GetConversationsController,
    GetMyConversationsController,
    GetConversationController,
    GetConversationMessagesController,
    SendMessageController,
    AddParticipantController,
    RemoveParticipantController,
  ],
  providers: [
    CreateConversationUseCase,
    GetConversationsUseCase,
    GetMyConversationsUseCase,
    GetConversationUseCase,
    GetConversationMessagesUseCase,
    SendMessageUseCase,
    AddParticipantUseCase,
    RemoveParticipantUseCase,
    ConversationParticipantGuard,
    ChatGateway,
  ],
  exports: [ChatGateway],
})
export class ConversationModule {}
