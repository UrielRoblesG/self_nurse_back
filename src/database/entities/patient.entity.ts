import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatPatientStatusEntity } from './cat.patient.status.entity';
import { EventoEntity } from './evento.entity';

@Entity({ name: 'paciente' })
export class PatientEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'genero' })
  gender: string;

  @Column({ name: 'edad' })
  age: number;

  @Column({ name: 'tipo_sangre' })
  bloodType: string;

  @Column({ name: 'altura' })
  height: number;

  @Column({ name: 'peso' })
  weight: number;

  @ManyToOne(() => CatPatientStatusEntity, { eager: true })
  idStatus: CatPatientStatusEntity;

  @OneToMany(() => EventoEntity, (e) => e.paciente)
  eventos: EventoEntity[];
}
