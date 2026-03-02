import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@src/modules/user/user.entity";
import { CookImage } from "@src/modules/cook/cookImage.entity";

export enum CookSpeciality {
  INDIAN = "indian",
  FRENCH = "french",
  ITALIAN = "italien",
}

@Entity("cook")
export class Cook {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  description: string;

  @Column({ type: "enum", enum: CookSpeciality })
  speciality: CookSpeciality;

  @Column({ name: "hourly_rate" })
  hourlyRate: string;

  @Column()
  city: string;

  @OneToMany(() => CookImage, (image) => image.cook)
  images: CookImage[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
