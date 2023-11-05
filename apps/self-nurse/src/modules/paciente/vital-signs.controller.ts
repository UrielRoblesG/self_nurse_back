import { Controller } from '@nestjs/common';
import { VitalSignsService } from './vital-signs.service';

@Controller('vital-signs')
export class VitalSignsController {
  constructor(private readonly vitalSignsService: VitalSignsService) {}

}
