import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'vital_signs' })
export class VitalSignsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  oxigenacion: number;

  @Column({ type: 'int' })
  ritmo: number;

  @Column({ type: 'float' })
  temperatura: number;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'int' })
  userId: number;
}
