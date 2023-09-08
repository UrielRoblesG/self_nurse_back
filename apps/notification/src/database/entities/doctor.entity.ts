import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientEntity } from './patient.entity';

@Entity({ name: 'doctor' })
export class DoctorEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'cedula', length: 10 })
  idm: string;

  @Column({ name: 'especialidad', length: 100 })
  especialidad: string;

  @OneToMany(() => PatientEntity, (p) => p.doctor)
  pacientes: PatientEntity[];
}
