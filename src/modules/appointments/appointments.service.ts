import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Appointments } from '@prisma/client'

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) {}
   
    async bookAppointment(dto: CreateAppointmentDto) {
        try {
          const { userId, hospitalId, date } = dto;
          const isoDate = new Date(date + "T00:00:00.00Z");
          const existingHospital = await this.prisma.hospitals.findUnique({
            where: { id: hospitalId },
          });
          
          if (!existingHospital) {
            throw new Error('Invalid hospitalId');
          }
          
          const existingAppointmentsCount = await this.prisma.appointments.count({
            where: {
              date: isoDate,
              hospitalId,
            },
          });
      
          // For the first booking, orderNumber is 1, else increment by 1
          const orderNumber = existingAppointmentsCount === 0 ? 1 : existingAppointmentsCount + 1;
      
          // Tính toán estimated và endTime
          const baseTime = new Date(`${date}T08:00:00`);
          const incrementMinutes = (orderNumber - 1) * 20;
      
          const estimated = new Date(baseTime);
          estimated.setMinutes(baseTime.getMinutes() + incrementMinutes);
      
          const endTime = new Date(estimated);
          endTime.setMinutes(endTime.getMinutes() + 20);
      
          // Check if the Date objects are valid before converting to ISO string
          const isValidDate = (date: Date) => !isNaN(date.getTime());
      
          if (isValidDate(estimated) && isValidDate(endTime)) {
            // Tạo đối tượng appointment
            const appointment = await this.prisma.appointments.create({
              data: {
                userId,
                hospitalId,
                orderNumber,
                estimated: estimated.toISOString(), // Convert to ISO string
                endTime: endTime.toISOString(), // Convert to ISO string
                date: isoDate.toISOString(), // Convert to ISO string
                status: 'Booked',
              },
            });
      
            return appointment;
          } else {
            // Handle invalid date scenario
            throw new Error('Invalid date calculation');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Error creating appointment');
        }
      }
      
      
      
      
}
