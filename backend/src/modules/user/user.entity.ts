import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum UserRole {
  COOK = "cook",
  CLIENT = "client",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: "enum", enum: UserRole })
  role: UserRole;

  @Column({ select: false })
  password: string;

  @Column({ name: "refresh_token", nullable: true, select: false })
  refreshToken: string | null;

  @Column({
    name: "refresh_token_expires_at",
    type: "timestamp",
    nullable: true,
  })
  refreshTokenExpiresAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;
}
