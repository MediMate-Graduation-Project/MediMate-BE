import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Hospitals } from '@prisma/client';
import { successException } from 'src/commons/Exception/succesExeption';
import { CreateHospitalDto } from './dto/CreateHospitalDto';
import axios from 'axios';
require('dotenv').config();

@Injectable()
export class HospitalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHospitals(): Promise<Hospitals[]> {
    const hospitalsWithReviews = await this.prismaService.hospitals.findMany({
      where: {
        status: 'ACTIVE',
      },
      include: {
        reviews: {
          select: {
            rating: true,
            review: true,
            date_review: true,
            users: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  
    const hospitalsWithAggregates = hospitalsWithReviews.map((hospital) => {
      const reviewCount = hospital.reviews.length;
      const averageRating =
        reviewCount > 0
          ? hospital.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
          : 0;
  
      return {
        ...hospital,
        maxReviewCount: reviewCount,
        averageRating: Math.floor(averageRating / 2) * 2,
      };
    });
  
    return hospitalsWithAggregates;
  }

  
  async getNearbyHospitals(lat: number, lon: number): Promise<Hospitals[]> {
    const radius = 1000;
    const apiKey = process.env.MAP_API_KEY;  

    try {
      const response = await axios.get(`https://us1.locationiq.com/v1/nearby?key=${apiKey}&lat=${lat}&lon=${lon}&tag=hospital&radius=${radius}`);
      const nearbyHospitals = response.data;
      // console.log(nearbyHospitals)
      const databaseHospitals = await this.prismaService.hospitals.findMany();
      // console.log(databaseHospitals)
      
      const matchingHospitals = databaseHospitals.filter(dbHospital => {
        return nearbyHospitals.some(nearbyHospital => nearbyHospital.name === dbHospital.hospitalName);
      });

      const result = matchingHospitals.map(matchingHospital => {
        const nearbyHospital = nearbyHospitals.find(nearby => nearby.name === matchingHospital.hospitalName);
        let distanceInKilometers = nearbyHospital ? nearbyHospital.distance / 1000 : null;
        if (distanceInKilometers !== null) {
          distanceInKilometers = Math.round(distanceInKilometers * 10) / 10;
      }
      return {
        ...matchingHospital,
        distance: distanceInKilometers,
      };
      });

      return result;
    } catch (error) {
      throw new NotFoundException('Nearby hospitals not found');
    }
  
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
            hospitalType: createHospitalDto.hospitalType,
            address:createHospitalDto.address
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
  const hospitalWithReviews = await this.prismaService.hospitals.findUnique({
    where: {
      id: Number(id),
      status: 'ACTIVE',
    },
    include: {
      reviews: {
        select: {
          rating: true,
          review: true,
          date_review: true,
          users: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!hospitalWithReviews) {
    return null; 
  }

  const reviewCount = hospitalWithReviews.reviews.length;
  const averageRating =
    reviewCount > 0
      ? hospitalWithReviews.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  const hospitalWithAggregates = {
    ...hospitalWithReviews,
    maxReviewCount: reviewCount,
    averageRating: Math.floor(averageRating / 2) * 2,
  };

  return hospitalWithAggregates;
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
