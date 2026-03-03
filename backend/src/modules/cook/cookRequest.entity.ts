import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";
import { Client } from "@src/modules/client/client.entity";

@Entity("cook_request")
export class CookRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guests_number" })
  guestsNumber: number;

  @Column({ name: "start_date", nullable: true })
  startDate: Date;

  @Column({ name: "end_date", nullable: true })
  endDate: Date;

  @Column({ name: "cook_id" })
  cookId: number;

  @ManyToOne(() => Cook)
  @JoinColumn({ name: "cook_id" })
  cook: Cook;

  @Column({ name: "client_id" })
  clientId: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: "client_id" })
  client: Client;
}
