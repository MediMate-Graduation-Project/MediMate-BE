import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Appointments } from '@prisma/client'
import { formatAppointmentDates } from 'src/commons/utils/formatAppointmentDates';
import { successException } from 'src/commons/Exception/succesExeption';
import { AppointmentCountDto } from './dto/AppointmentCountDto ';
import { format } from 'date-fns';





@Injectable()
export class AppointmentsService {
    constructor(private readonly prismaService: PrismaService,
                ) {}
   
    async bookAppointment(dto: CreateAppointmentDto) {
        try {
          const { userId, hospitalId, date } = dto;
          const isoDate = new Date(date + "T00:00:00.00Z");
          const currentDate = new Date();  
          const minAllowedDate = new Date(currentDate);
          minAllowedDate.setHours(minAllowedDate.getHours() + 4);

          if (isoDate < minAllowedDate) {
            throw new HttpException('Invalid appointment date. Please choose a date in the future.',HttpStatus.BAD_REQUEST);
          }
          const existingHospital = await this.prismaService.hospitals.findUnique({
            where: { id: hospitalId },
          });
          
          if (!existingHospital) {
            throw new Error('Invalid hospitalId');
          }
          
          const existingAppointmentsCount = await this.prismaService.appointments.count({
            where: {
              date: isoDate,
              hospitalId,
            },
          });
      
          const orderNumber = existingAppointmentsCount === 0 ? 1 : existingAppointmentsCount + 1;
          const baseTime = new Date(`${date}T15:00:00`);
          const incrementMinutes = (orderNumber - 1) * 20;
          const estimated = new Date(baseTime);
          estimated.setMinutes(baseTime.getMinutes() + incrementMinutes);
          const endTime = new Date(estimated);
          endTime.setMinutes(endTime.getMinutes() + 20);
          const isValidDate = (date: Date) => !isNaN(date.getTime());
      
          if (isValidDate(estimated) && isValidDate(endTime)) {
            const appointment = await this.prismaService.appointments.create({
              data: {
                userId,
                hospitalId,
                orderNumber,
                estimated: estimated.toISOString(), 
                endTime: endTime.toISOString(), 
                date: isoDate.toISOString(), 
                status: 'Created',
              },
            });
      
            return appointment;
          } else {
            throw new Error('Invalid date calculation');
          }
        } catch (error) {
          if (error instanceof HttpException) {
            throw error; 
          } else {
            throw new HttpException('Error creating appointment', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }
      
      async getAppointmentsByUserId(userId: number) {
        try {
          const appointment = await this.prismaService.appointments.findFirst({
            where: {
              userId: Number(userId),
              status: 'Booked',
            },
            select: {
              id:true,
              hospital: {
                select: {
                  id:true,
                  hospitalName: true,
                  HospitalSpecialization: {
                    select: {
                     specialization:{
                      select:{
                        name:true,
                        clinic:true,
                        roomNumber:true
                      }
                     }
                    },
                  },
                },
              },
              orderNumber: true,
              estimated: true,
              endTime: true,
              date: true,
            },
          });
      
          if (!appointment) {
            throw new NotFoundException(`Appointments not found for user with ID ${userId}`);
          }
      
          appointment.estimated = new Date(appointment.estimated);
          appointment.endTime = new Date(appointment.endTime);
          appointment.date = new Date(appointment.date);
          formatAppointmentDates(appointment);
          return appointment;
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          } else {
            throw new HttpException('Error retrieving appointments', HttpStatus.INTERNAL_SERVER_ERROR);
          }
        }
      }
      
      async findMaxOrderNumberByDateAndHospital(hospitalId: number): Promise<AppointmentCountDto[]> {
        const groupedAppointments = await this.prismaService.appointments.groupBy({
          by: ['date'],
          where: { hospitalId: Number(hospitalId) , status:'Booked' },
          _max: {
            orderNumber: true,
          },
        });
        if (!groupedAppointments) {
          throw new NotFoundException(`Appointments not found for user with ID ${hospitalId}`);
        }
        const result: AppointmentCountDto[] = [];
    
        for (const item of groupedAppointments) {
          result.push({
            orderNumber: item._max.orderNumber,
            date: item.date,
            hospitalId: hospitalId,
          });
        }
    
        return result;
      }
    

      async deleteAppointment(Id: number): Promise<string> {
        const deletedUser = await this.prismaService.appointments.update({
          where: { id: Number(Id) },
          data: { status: "Unbook" }, 
        });
    
        if (!deletedUser) {
          throw new NotFoundException(`User with ID ${Id} not found`);
        }
        throw new successException("delete appointment succesfull");
      }

      async deleteAppointmentByDoctor(hospitalId: number): Promise<string> {
        const currentDate = format(new Date(), "yyyy-MM-dd'T'00:00:00.000'Z'");
        const deletedAppointment = await this.prismaService.appointments.findFirst({
          where: { hospitalId: Number(hospitalId),
                   status: 'Booked',
                   date:currentDate
           },
        });
      
        if (!deletedAppointment) {
          throw new NotFoundException(`User with ID ${hospitalId} not found`);
        }
       
        await this.prismaService.appointments.update({
          where: { id: Number( deletedAppointment.id) },
          data: {
            status: 'Unbook',
          },
        });
        throw new successException("delete user succesfull");
      }

      async updateAppointment(id: number): Promise<Appointments | null> {
        const updatedUser = await this.prismaService.appointments.update({
          where: { id: Number(id) },
          data:{ status: 'Booked' }
        });
    
        if (!updatedUser) {
          throw new NotFoundException(`Appointment with ID ${id} not found`);
        }
        return updatedUser;
      }

    
     
}
