import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Conversation } from "@src/modules/conversation/conversation.entity";
import { User } from "@src/modules/user/user.entity";

@Entity("message")
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "author_id" })
  authorId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author_id" })
  author: User;

  @Column({ name: "conversation_id" })
  conversationId: number;

  @ManyToOne(() => Conversation, (c) => c.messages)
  @JoinColumn({ name: "conversation_id" })
  conversation: Conversation;

  @Column({ type: "varchar" })
  message: string;

  @Column({ name: "image_url", type: "varchar", nullable: true, default: null })
  imageUrl: string | null;

  @Column({ name: "read_at", type: "timestamp", nullable: true, default: null })
  readAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
