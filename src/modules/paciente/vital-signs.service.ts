import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { VitalSignsEntity } from '../../database/entities';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectRepository(VitalSignsEntity)
    private vitalSignsRepository: Repository<VitalSignsEntity>,
  ) {}

  async findByUserIds(userIds: number[]): Promise<VitalSignsEntity[]> {
    return await this.vitalSignsRepository.find({
      where: {
        user: { id: In(userIds) }, 
      },
    });
  }
}
