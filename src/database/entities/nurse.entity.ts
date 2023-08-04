import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CatRelationshipEntity } from './cat.relationship.enity';
import { EventoEntity } from './evento.entity';

@Entity({ name: 'cuidador' })
export class NurseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToMany(() => EventoEntity, (e) => e.nurse)
  eventos: EventoEntity[];
}
