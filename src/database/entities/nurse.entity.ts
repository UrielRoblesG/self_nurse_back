import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EventoEntity } from './evento.entity';
import { PatientEntity } from './patient.entity';

@Entity({ name: 'cuidador' })
export class NurseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => EventoEntity, (e) => e.nurse)
  eventos: EventoEntity[];

  @OneToOne(() => PatientEntity)
  paciente: PatientEntity;
}
