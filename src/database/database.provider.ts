import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from 'src/common/enums';
import {
  UserEntity,
  CatUserType,
  PatientEntity,
  DoctorEntity,
  NurseEntity,
  CatRelationshipEntity,
  CatPatientStatusEntity,
  EventoEntity,
} from './entities/index';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';
import { ViewGetPacienteEventos } from './views';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const isDevMode = config.get('NODE_ENV') !== Environment.Production;
    console.log(
      `Modo de desarrollo ${isDevMode ? 'Desarrollo' : 'Produccion'}`,
    );
    const dbConfig = {
      type: 'mysql',
      host: config.get('DB_HOST'),
      port: +config.get('DB_PORT'),
      username: config.get('MYSQL_USER'),
      password: config.get('MYSQL_PASSWORD'),
      database: config.get('DB_NAME'),
      entities: [
        UserEntity,
        CatUserType,
        PatientEntity,
        DoctorEntity,
        NurseEntity,
        CatRelationshipEntity,
        CatPatientStatusEntity,
        EventoEntity,
        ViewGetPacienteEventos,
      ],
      synchronize: isDevMode,
      autoLoadEntities: true,
      logging: config.get('DB_LOGGING'),
    } as ConnectionOptions;
    console.log(dbConfig);
    return dbConfig;
  },
});
