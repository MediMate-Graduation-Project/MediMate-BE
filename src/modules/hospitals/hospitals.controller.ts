import { Controller, Get, Param, Patch, Body, Delete, Req, Post } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { Hospitals } from '@prisma/client';
import { CreateHospitalDto } from './dto/CreateHospitalDto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  async getAllHospital(): Promise<Hospitals[]> {
    return this.hospitalsService.getAllHospitals();
  }

  @Post('')
   register(@Body() body:CreateHospitalDto) {
    return this.hospitalsService.createHospital(body);
  }

  @Get(':id')
  async getHospitalById(@Param('id') id: number): Promise<Hospitals | null> {
    return this.hospitalsService.getHospitalById(id);
  }

  @Patch(':id')
  async updateHospital(@Param('id') id: number, @Body() data: Partial<Hospitals>): Promise<Hospitals | null> {
    return this.hospitalsService.updateHospital(id, data);
  }

  @Delete(':id')
  async deleteHospital(@Param('id') id: number): Promise<void> {
    return this.hospitalsService.deleteHospital(id);
  }
}
