import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'doctor' })
export class DoctorEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'cedula', length: 10 })
  idm: string;

  @Column({ name: 'especialidad', length: 100 })
  especialidad: string;
}
