import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cat_tipo_usuarios' })
export class CatUserType {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nombre' })
  name: string;
}
