import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatRelationshipEntity } from './cat.relationship.enity';

@Entity({ name: 'cuidador' })
export class CaregiverEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CatRelationshipEntity, { cascade: true })
  relationship: CatRelationshipEntity;
}
