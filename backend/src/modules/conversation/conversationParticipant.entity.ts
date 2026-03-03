import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { User } from "@src/modules/user/user.entity";

@Entity("conversation_participant")
export class ConversationParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "author_id" })
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  author: User;

  @Column({ name: "conversation_id" })
  conversationId: number;

  @ManyToOne(() => Conversation, (c) => c.participants)
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
