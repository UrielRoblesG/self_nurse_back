import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSignsEntity } from './entities/vital-signs.entity';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectRepository(VitalSignsEntity)
    private vitalSignsRepository: Repository<VitalSignsEntity>,
  ) {}

}
