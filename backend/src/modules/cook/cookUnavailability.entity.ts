import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Entity("cook_unavailability")
@Unique(["cookId", "date"])
export class CookUnavailability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @ManyToOne(() => Cook)
  @JoinColumn({ name: "cook_id" })
  cook: Cook;

  @Column({ type: "varchar", length: 10 })
  date: string; // YYYY-MM-DD

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
