import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async findByUserIds(userIds: number[]): Promise<any[]> {
    const userIdsString = userIds.join(', ');

    const query = `
      SELECT 
        vs.id, vs.oxigenacion, vs.ritmo, vs.temperatura, vs.fecha, 
        u.id AS userId, u.nombre, u.email
      FROM 
        vitalSigns AS vs
      JOIN 
        usuario AS u ON vs.userId = u.id
      WHERE 
        vs.userId IN (${userIdsString})
    `;

    return await this.entityManager.query(query);
  }
}
