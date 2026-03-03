import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @ApiProperty({ example: "2026-03-15T22:00:00.000Z" })
  @Column({ name: "end_date", type: "timestamp" })
  endDate: Date;

  @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
  @Column({ name: "cook_id", type: "uuid" })
  cookId: string;

  @ApiProperty({ example: 1 })
  @Column({ name: "client_id", type: "int" })
  clientId: number;
}
