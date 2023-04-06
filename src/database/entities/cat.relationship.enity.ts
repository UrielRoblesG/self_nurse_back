import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cat_parentesco' })
export class CatRelationshipEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nombre' })
  name: string;
}
