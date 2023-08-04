import {
  AfterRemove,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { NurseEntity, PatientEntity, UserEntity } from './index';

@Entity({ name: 'evento' })
export class EventoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  alerta: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  valor: number;

  @Column({
    name: 'signo_vital',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  signoVital: string;

  @Column({ name: 'fecha', type: 'datetime' })
  fecha: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // @Column({ name: 'paciente_id', type: 'number' })
  // paciente: number;

  @ManyToOne(() => PatientEntity, (p) => p.eventos)
  paciente: PatientEntity;

  @ManyToOne(() => NurseEntity, (n) => n.eventos)
  nurse: NurseEntity;

  @AfterRemove()
  updateStatus() {
    this.deletedAt = new Date();
  }
}
