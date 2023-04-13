import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cat_user_relationship' })
export class CatUserRelationshipEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'titulo' })
  title: string;
}
