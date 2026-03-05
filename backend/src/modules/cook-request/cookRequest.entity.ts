import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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
  PAID = "paid",
}

export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
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

  @ApiProperty({ example: "dinner", enum: MealType })
  @Column({
    name: "meal_type",
    type: "enum",
    enum: MealType,
    default: MealType.DINNER,
  })
  mealType: MealType;

  @ApiPropertyOptional({ example: "Bonjour, je souhaite un menu végétarien." })
  @Column({ type: "text", nullable: true })
  message: string | null;

  @ApiPropertyOptional({ example: 1 })
  @Column({ name: "conversation_id", type: "int", nullable: true })
  conversationId: number | null;

  @ApiProperty({
    example: "Je ne suis plus disponible à cette date",
    nullable: true,
  })
  @Column({
    name: "cancellation_reason",
    type: "text",
    nullable: true,
  })
  cancellationReason: string | null;

  @Column({ nullable: true })
  street: string | null;

  @Column({ name: "postal_code", nullable: true })
  postalCode: string | null;

  @Column({ nullable: true })
  city: string | null;
}
