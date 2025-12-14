import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ConversionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

@Entity({ name: 'conversion_items' })
export class ConversionItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'double precision', default: 0 })
  progress!: number;

  @Column({ type: 'text' })
  fileName!: string;

  @Column({ type: 'text', nullable: true })
  error?: string | null;

  @Column({ enum:ConversionStatus, default: ConversionStatus.PENDING })
  status!: ConversionStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
