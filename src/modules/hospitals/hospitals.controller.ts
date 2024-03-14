import { Controller, Get, Param, Patch, Body, Delete, Req, Post, Query } from '@nestjs/common';
import { HospitalsService } from './hospitals.service';
import { Hospitals } from '@prisma/client';
import { CreateHospitalDto } from './dto/CreateHospitalDto';

@Controller('hospitals')
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  async getAllHospital(): Promise<Hospitals[]> {
    return await this.hospitalsService.getAllHospitals();
  }

  @Get('map')
  async getNearbyHospitals(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ) {
    const nearbyHospitals = await this.hospitalsService.getNearbyHospitals(lat, lon);

    return nearbyHospitals;
  }

  @Post('')
   async createHospital(@Body() body:CreateHospitalDto) {
    return await this.hospitalsService.createHospital(body);
  }

  @Get(':id')
  async getHospitalById(@Param('id') id: number): Promise<Hospitals | null> {
    return await this.hospitalsService.getHospitalById(id);
  }

  @Patch(':id')
  async updateHospital(@Param('id') id: number, @Body() data: Partial<Hospitals>): Promise<Hospitals | null> {
    return await this.hospitalsService.updateHospital(id, data);
  }

  @Delete(':id')
  async deleteHospital(@Param('id') id: number): Promise<void> {
    return await this.hospitalsService.deleteHospital(id);
  }
}
