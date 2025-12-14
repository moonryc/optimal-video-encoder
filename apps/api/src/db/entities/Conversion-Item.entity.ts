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
  path!: string;

  @Column({ type: 'double precision' })
  duration!: number;

  @Column({ type: 'boolean' })
  is4k!: boolean;

  @Column({ type: 'text', nullable: true })
  error?: string | null;

  @Column({ enum:ConversionStatus, default: ConversionStatus.PENDING })
  status!: ConversionStatus;

  @Column({type: 'timestamp with time zone', nullable: true,})
  startedAt?: Date | null;

  @Column({type: 'timestamp with time zone', nullable: true,})
  erroredAt?: Date | null;

  @Column({type: 'timestamp with time zone', nullable: true,})
  completedAt?: Date | null;

  @Column({type: 'int', default: 0})
  stallCounter!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
