import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './index';

@Entity({ name: 'vitalSigns' })
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

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' }) 
  user: UserEntity;
}
