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

  @Column({ name: 'recordar', type: 'bool', default: false })
  recordar: Boolean;

  @AfterRemove()
  updateStatus() {
    this.deletedAt = new Date();
  }
}
