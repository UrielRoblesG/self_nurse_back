import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatRelationshipEntity } from 'src/database/entities/cat.relationship.enity';
import { Repository } from 'typeorm';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(CatRelationshipEntity)
    private readonly catRelationshipRepository: Repository<CatRelationshipEntity>,
  ) {}
  async create(createRelationshipDto: CreateRelationshipDto) {
    const relationship = this.catRelationshipRepository.create({
      name: createRelationshipDto.relacion,
    });

    const resp = await this.catRelationshipRepository.save(relationship);

    return resp;
  }
  async createEntity(title: string) {
    const relationship = this.catRelationshipRepository.create({
      name: title,
    });

    return relationship;
  }

  findAll() {
    return `This action returns all relationship`;
  }

  async findOne(id: number): Promise<CatRelationshipEntity> {
    try {
      const relationship = await this.catRelationshipRepository.findOneBy({
        id,
      });

      if (!relationship) {
        throw new NotFoundException('No existe tal relacion');
      }

      return relationship;
    } catch (error) {}
  }

  update(id: number, updateRelationshipDto: UpdateRelationshipDto) {
    return `This action updates a #${id} relationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} relationship`;
  }
}
