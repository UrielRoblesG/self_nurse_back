import { DataSource, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource.createQueryBuilder().select(),
})
export class ViewGetUserData {}
