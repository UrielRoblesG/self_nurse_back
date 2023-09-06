import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Logger,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { RelationshipService } from './relationship.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Relacion cuidador')
@Controller('/api/relationship')
export class RelationshipController {
  private readonly logger = new Logger(RelationshipController.name);

  constructor(private readonly relationshipService: RelationshipService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  async create(
    @Res() res: Response,
    @Body() createRelationshipDto: CreateRelationshipDto,
  ) {
    try {
      const resp = await this.relationshipService.create(createRelationshipDto);

      return res.status(HttpStatus.OK).json({
        msg: 'Operación exitosa',
        data: resp,
      });
    } catch (error) {
      this.logger.error(error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: 'Error: contacte con el servidor',
      });
    }
  }

  @Get()
  @Public()
  async findAll(@Res() res: Response) {
    try {
      const resp = await this.relationshipService.findAll();

      return res.status(HttpStatus.OK).json({
        msg: 'Operacion exitosa',
        count: resp.length,
        items: resp,
      });
    } catch (error) {}
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.relationshipService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  update(
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ) {
    return this.relationshipService.update(+id, updateRelationshipDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.relationshipService.remove(+id);
  }
}
