import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Appointments } from '@prisma/client'
import { formatAppointmentDates } from 'src/commons/utils/formatAppointmentDates';
import { successException } from 'src/commons/Exception/succesExeption';


@Injectable()
export class AppointmentsService {
    constructor(private prismaService: PrismaService) {}
   
    async bookAppointment(dto: CreateAppointmentDto) {
        try {
          const { userId, hospitalId, date } = dto;
          const isoDate = new Date(date + "T00:00:00.00Z");
          const currentDate = new Date(); 
          console.log(currentDate)
          console.log(isoDate)
          if (isoDate < currentDate) {
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
                status: 'Booked',
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
              hospital: {
                select: {
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
      

      async deleteAppointment(appointmentId: number): Promise<string> {
        try {
          const appointment = await this.prismaService.appointments.findUnique({
            where: { id: Number(appointmentId), status: "Booked" },
          });
      
          if (!appointment) {
            throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
          }
      
          await this.prismaService.appointments.update({
            where: { id: Number(appointmentId) },
            data: { status: 'UnBook' },
          });
      
          return 'Delete successful';
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          } else {
            console.error('Error deleting appointment:', error);
            throw new Error('Error deleting appointment');
          }
        }
      }
      
    
    
}
