import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CookImage } from "@src/modules/cook/cookImage.entity";
import { User } from "@src/modules/user/user.entity";

@Entity()
export class Cook {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) photoUrl: string | null;
  @Column({ nullable: true, type: "text" }) description: string | null;
  @Column() speciality: string;
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  hourlyRate: number | null;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: false }) isValidated: boolean;

  @Column({ name: "user_id", nullable: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => CookImage, (image) => image.cook)
  images: CookImage[];
}
