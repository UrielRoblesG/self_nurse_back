import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CatUserType } from 'src/database/entities/cat.user.type';
import { Not, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(CatUserType)
    private readonly catUserTypeRepository: Repository<CatUserType>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(): Promise<CatUserType[]> {
    const categorias = await this.catUserTypeRepository.find({
      where: { id: Not(4) },
    });

    if (categorias.length == 0) {
      throw new Error('Error al obtener las categorias');
    }

    return categorias;
  }
  async findAllAdmin(): Promise<CatUserType[]> {
    const categorias = await this.catUserTypeRepository.find({});

    if (categorias.length == 0) {
      throw new Error('Error al obtener las categorias');
    }

    return categorias;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
