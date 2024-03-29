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

import { NurseEntity, PatientEntity } from './index';

@Entity({ name: 'evento' })
export class EventoEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  alerta: string;

  @Column({ name: 'fecha', type: 'timestamp' })
  fecha: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  // U = Unico --- S = Semanal
  @Column({ name: 'frecuencia', type: 'char', length: 1, default: 'U' })
  frecuencia: string;

  // A = Activo --- I = Inactivo
  @Column({ name: 'estatus', type: 'char', length: 1, default: 'A' })
  estatus: string;

  @ManyToOne(() => PatientEntity, (p) => p.eventos)
  paciente: PatientEntity;

  @ManyToOne(() => NurseEntity, (n) => n.eventos)
  nurse: NurseEntity;

  @Column({ name: 'recordar', type: 'bool', default: false })
  recordar: boolean;

  @Column({ name: 'tipo', type: 'smallint' })
  tipo: number;

  @AfterRemove()
  updateStatus() {
    this.deletedAt = new Date();
  }
}
