import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/models/user';

@Injectable()
export class UserService {
  private readonly logger = new Logger();

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: User): Promise<UserEntity> {
    try {
      const user = this.createUser(createUserDto);
      const resp = await this.userRepository.save(user);

      return resp;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      const users = await this.userRepository.find({});
      if (users.length <= 0) {
        throw new Error('Sin registros');
      }
      return users;
    } catch (error) {
      this.logger.error(`Error FindAll: ${error}`);
    }
  }

  async findOneById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOneBy({ id: id });

      if (user === null) {
        throw new Error('No se encontro el registro');
      }

      return user;
    } catch (error) {
      this.logger.error(`Error on findOneById: ${error}`);
    }
  }
  async findOneByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email: email,
      deletedAt: null,
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async save(user: UserEntity): Promise<boolean> {
    try {
      const resp = await this.userRepository.save(user);

      return resp !== null ? true : false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async remove(id: number): Promise<boolean> {
    const success = await this.userRepository.softDelete({ id: id });

    if (success === null) {
      return false;
    }

    return true;
  }

  private createUser(object: User): UserEntity {
    const user = this.userRepository.create({
      name: object.name,
      firstName: object.firstName,
      secondLastName: object.secondLastName,
      idType: object.type,
      email: object.email,
      password: object.password,
    });
    return user;
  }
}
