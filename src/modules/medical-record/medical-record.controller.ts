import { Controller } from '@nestjs/common';
import { MedicalRecordService } from './medical-record.service';

@Controller('medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}
}
