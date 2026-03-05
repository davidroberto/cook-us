import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";
import { SendMessageUseCase } from "@src/modules/conversation/sendMessage/sendMessage.useCase";
import { MarkMessagesAsReadUseCase } from "@src/modules/conversation/markMessagesAsRead/markMessagesAsRead.useCase";
import { Inject, Logger, forwardRef } from "@nestjs/common";

interface AuthenticatedSocket extends Socket {
  userId: number;
}

@WebSocketGateway({
  namespace: "/chat",
  cors: { origin: "*" },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @Inject(forwardRef(() => SendMessageUseCase))
    private readonly sendMessageUseCase: SendMessageUseCase,
    @Inject(forwardRef(() => MarkMessagesAsReadUseCase))
    private readonly markMessagesAsReadUseCase: MarkMessagesAsReadUseCase
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace("Bearer ", "");

      if (!token) {
        this.logger.warn("Connection refused: no token");
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;

      const participations = await this.participantRepository.find({
        where: { authorId: client.userId },
        select: ["conversationId"],
      });

      for (const p of participations) {
        client.join(`conversation:${p.conversationId}`);
      }

      this.logger.log(
        `User ${client.userId} connected, joined ${participations.length} rooms`
      );
    } catch {
      this.logger.warn("Connection refused: invalid token");
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`User ${client.userId ?? "unknown"} disconnected`);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number; message: string }
  ) {
    const { conversationId, message: messageContent } = data;

    const participant = await this.participantRepository.findOne({
      where: { conversationId, authorId: client.userId },
    });

    if (!participant) {
      return { error: "Vous n'êtes pas participant de cette conversation" };
    }

    const savedMessage = await this.sendMessageUseCase.execute(
      conversationId,
      client.userId,
      { message: messageContent }
    );

    return savedMessage;
  }

  @SubscribeMessage("joinConversation")
  async handleJoinConversation(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number }
  ) {
    const participant = await this.participantRepository.findOne({
      where: { conversationId: data.conversationId, authorId: client.userId },
    });

    if (!participant) {
      return { error: "Vous n'êtes pas participant de cette conversation" };
    }

    client.join(`conversation:${data.conversationId}`);
    return { joined: data.conversationId };
  }

  @SubscribeMessage("markAsRead")
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { conversationId: number }
  ) {
    const { conversationId } = data;

    const participant = await this.participantRepository.findOne({
      where: { conversationId, authorId: client.userId },
    });

    if (!participant) {
      return { error: "Vous n'êtes pas participant de cette conversation" };
    }

    return this.markMessagesAsReadUseCase.execute(
      conversationId,
      client.userId
    );
  }

  emitToConversation(conversationId: number, event: string, data: unknown) {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }
}
