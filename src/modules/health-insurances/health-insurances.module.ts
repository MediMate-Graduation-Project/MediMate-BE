import { Module } from '@nestjs/common';
import { HealthInsurancesService } from './health-insurances.service';
import { HealthInsurancesController } from './health-insurances.controller';

@Module({
  controllers: [HealthInsurancesController],
  providers: [HealthInsurancesService],
})
export class HealthInsurancesModule {}
