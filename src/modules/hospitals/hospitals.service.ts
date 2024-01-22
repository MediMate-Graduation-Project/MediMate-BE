import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Hospitals } from '@prisma/client';
import { successException } from 'src/commons/Exception/succesExeption';
import { CreateHospitalDto } from './dto/CreateHospitalDto';

@Injectable()
export class HospitalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHospitals(): Promise<Hospitals[]> {
    return this.prismaService.hospitals.findMany({
      where: {
        status: 'ACTIVE',
      },
    });
  }

  async createHospital(createHospitalDto: CreateHospitalDto)  {
    const { hospitalName } = createHospitalDto;
    const existinghospital = await this.prismaService.hospitals.findUnique({
      where: {hospitalName},
    }) as Hospitals;
    if (existinghospital) {
      throw new ConflictException('hospital already exists');
    }
    const newHospital = await this.prismaService.hospitals.create({
        data: {
            hospitalName: createHospitalDto.hospitalName,
            industryCode: createHospitalDto.industryCode,
            specializationId: createHospitalDto.specializationId,
            hospitalType: createHospitalDto.hospitalType,
          },
          select:{
            id:true,
            hospitalName:true,
            createdAt:true
          }    
    });
    return newHospital
  }
  async getHospitalById(id: number): Promise<Hospitals | null> {
    const Hospital = await this.prismaService.hospitals.findUnique({
      where: {
        id: Number(id),
        status: 'ACTIVE',
      },
    });
    if (!Hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    return Hospital;
  }

  async updateHospital(
    id: number,
    data: Partial<Hospitals>,
  ): Promise<Hospitals | null> {
    const updatedHospital = await this.prismaService.hospitals.update({
      where: { id: Number(id) },
      data,
    });

    if (!updatedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }

    return updatedHospital;
  }

  async deleteHospital(id: number): Promise<void> {
    const deletedHospital = await this.prismaService.hospitals.update({
      where: { id: Number(id) },
      data: { status: 'INACTIVE' }, 
    });

    if (!deletedHospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    throw new successException('delete Hospital succesfull');
  }
}
