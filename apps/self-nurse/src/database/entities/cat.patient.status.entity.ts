import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cat_paciente_status' })
export class CatPatientStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nombre' })
  name: string;

  @Column({ name: 'descripcion' })
  description: string;
}
