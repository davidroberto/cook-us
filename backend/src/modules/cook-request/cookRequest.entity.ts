import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("cook_request")
export class CookRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "guests_number", type: "int" })
  guestsNumber: number;

  @Column({ name: "start_date", type: "timestamp" })
  startDate: Date;

  @Column({ name: "end_date", type: "timestamp" })
  endDate: Date;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @Column({ name: "client_id", type: "int" })
  clientId: number;
}
