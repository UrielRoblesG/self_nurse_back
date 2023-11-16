import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { UserEntity } from '../entities';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('u.id', 'id')
      .addSelect('u.nombre', 'nombre')
      .addSelect('u.apellidoPaterno', 'apellidoPaterno')
      .addSelect('u.apellidoMaterno', 'apellidoMaterno')
      .addSelect('u.email')
      .addSelect('u.phone')
      .addSelect('u.idType')
      .addSelect('u.imgUrl')
      .from(UserEntity, 'u')
      .leftJoin('u.caregiverId', 'nurseId')
      .where('u.deleted_at is null'),
})
export class ViewGetUserNurse {
  @ViewColumn()
  id: number;

  @ViewColumn()
  nombre: string;

  @ViewColumn()
  apellidoPaterno: string;

  @ViewColumn()
  apellidoMaterno: string;

  @ViewColumn()
  email: string;

  @ViewColumn()
  phone: string;

  @ViewColumn()
  idType: number;

  @ViewColumn()
  imgUrl: string;

  @ViewColumn()
  nurseId: number;
}
