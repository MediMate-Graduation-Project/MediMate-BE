import { Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ROLES } from '../auth/decorator/role.decorator';
import { Role } from 'src/commons/constants/role.enum';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  
  @UseGuards(JwtAuthGuard)
  @ROLES(Role.Hospital)
  @Patch('doctor/:hospitalId')
  async updateAppointmentByDoctor(@Param('hospitalId') hospitalId: number  ): Promise<string> {
    return await this.doctorsService.updateAppointmentByDoctor(hospitalId);
  }
  
}
