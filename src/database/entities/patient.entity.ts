import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatPatientStatusEntity } from './cat.patient.status.entity';

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

  @ManyToOne(() => CatPatientStatusEntity)
  idStatus: CatPatientStatusEntity;
}
