import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cook {
  @PrimaryGeneratedColumn("uuid") id: string;
  @Column() firstName: string;
  @Column() lastName: string;
  @Column({ nullable: true }) photoUrl: string | null;
  @Column({ nullable: true, type: "text" }) description: string | null;
  @Column() speciality: string;
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true }) hourlyRate: number | null;
  @Column({ default: true }) isActive: boolean;
  @Column({ default: false }) isValidated: boolean;
}
