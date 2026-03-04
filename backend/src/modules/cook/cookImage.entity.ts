import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cook } from "@src/modules/cook/cook.entity";

@Entity("cook_image")
export class CookImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @ManyToOne(() => Cook, (cook) => cook.images)
  @JoinColumn({ name: "cook_id" })
  cook: Cook;

  @Column({ name: "img_url" })
  imgUrl: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
