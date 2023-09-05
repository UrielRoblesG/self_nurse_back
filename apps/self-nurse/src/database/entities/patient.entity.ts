import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CatPatientStatusEntity } from './cat.patient.status.entity';
import { EventoEntity } from './evento.entity';
import { NurseEntity } from './nurse.entity';
import { DoctorEntity } from './doctor.entity';

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

  @Column({ name: 'codigo', length: 10, type: 'varchar', nullable: true })
  codigo: string;

  @ManyToOne(() => CatPatientStatusEntity, { eager: true })
  idStatus: CatPatientStatusEntity;

  @OneToMany(() => EventoEntity, (e) => e.paciente)
  eventos: EventoEntity[];

  @OneToOne(() => NurseEntity, (nurse) => nurse.paciente)
  @JoinColumn()
  nurse: NurseEntity;

  @ManyToOne(() => DoctorEntity, (d) => d.pacientes)
  doctor: DoctorEntity;
}
