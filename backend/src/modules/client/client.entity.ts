import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "@src/modules/user/user.entity";

@Entity("client")
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ nullable: true })
  street: string | null;

  @Column({ name: "postal_code", nullable: true })
  postalCode: string | null;

  @Column({ nullable: true })
  city: string | null;
}
