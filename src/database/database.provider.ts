import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Environment } from 'src/common/enums';
import { ConnectionOptions } from 'typeorm';

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
      username: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
      //   entities: [
      //     UserEntity,
      //     CatUserType,
      //     PatientEntity,
      //     DoctorEntity,
      //     CaregiverEntity,
      //     CatRelationshipEntity,
      //     CatPatientStatusEntity,
      //   ],
      synchronize: isDevMode,
      autoLoadEntities: true,
      logging: config.get('DB_LOGGING'),
    } as ConnectionOptions;
    console.log(dbConfig);
    return dbConfig;
  },
});
