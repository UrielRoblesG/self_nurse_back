import { Module } from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { RelationshipController } from './relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatRelationshipEntity } from '../../../database/entities/cat.relationship.enity';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatRelationshipEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService, JwtService],
  exports: [RelationshipService],
})
export class RelationshipModule {}
