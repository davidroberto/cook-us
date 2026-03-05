import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";
import { CookRequestEntity } from "@src/modules/cook-request/cookRequest.entity";

@Entity("review")
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @Column({ type: "int" })
  rating: number;

  @ApiPropertyOptional({ example: "Excellent repas, je recommande !" })
  @Column({ type: "text", nullable: true })
  comment: string | null;

  @Column({ name: "client_id" })
  clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "client_id" })
  client: Client;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @ManyToOne(() => Cook, (cook) => cook.reviews)
  @JoinColumn({ name: "cook_id" })
  cook: Cook;

  @Column({ name: "cook_request_id" })
  cookRequestId: number;

  @OneToOne(() => CookRequestEntity)
  @JoinColumn({ name: "cook_request_id" })
  cookRequest: CookRequestEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
