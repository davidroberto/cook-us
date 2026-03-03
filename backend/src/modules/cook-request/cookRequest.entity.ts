import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";

export enum CookRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REFUSED = "refused",
  CANCELLED = "cancelled",
}

@Entity("cook_request")
export class CookRequestEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 4 })
  @Column({ name: "guests_number", type: "int" })
  guestsNumber: number;

  @ApiProperty({ example: "2026-03-15T18:00:00.000Z" })
  @Column({ name: "start_date", type: "timestamp" })
  startDate: Date;

  @ApiProperty({ example: "2026-03-15T22:00:00.000Z", nullable: true })
  @Column({ name: "end_date", type: "timestamp", nullable: true })
  endDate: Date | null;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @ManyToOne(() => Cook)
  @JoinColumn({ name: "cook_id" })
  cook: Cook;

  @Column({ name: "client_id", type: "int" })
  clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "client_id" })
  client: Client;

  @ApiProperty({ example: "pending", enum: CookRequestStatus })
  @Column({
    type: "enum",
    enum: CookRequestStatus,
    default: CookRequestStatus.PENDING,
  })
  status: CookRequestStatus;
}
