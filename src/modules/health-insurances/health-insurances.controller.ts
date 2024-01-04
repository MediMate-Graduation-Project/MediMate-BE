import { Controller } from '@nestjs/common';
import { HealthInsurancesService } from './health-insurances.service';

@Controller('health-insurances')
export class HealthInsurancesController {
  constructor(private readonly healthInsurancesService: HealthInsurancesService) {}
}
