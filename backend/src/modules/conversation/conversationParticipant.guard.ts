import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConversationParticipant } from "@src/modules/conversation/conversationParticipant.entity";

@Injectable()
export class ConversationParticipantGuard implements CanActivate {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const conversationId = Number(request.params.id);

    if (!userId || !conversationId) {
      throw new ForbiddenException("Accès refusé");
    }

    const participant = await this.participantRepository.findOne({
      where: {
        conversationId,
        authorId: userId,
      },
    });

    if (!participant) {
      throw new ForbiddenException(
        "Vous n'êtes pas participant de cette conversation"
      );
    }

    return true;
  }
}
