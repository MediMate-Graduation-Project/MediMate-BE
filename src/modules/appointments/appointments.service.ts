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
          currentDate.setHours(0,0,0,0)
          // const minAllowedDate = new Date(currentDate);
          // minAllowedDate.setHours(minAllowedDate.getHours()+7);
          // console.log(isoDate)
          // console.log(minAllowedDate)
          if (isoDate < currentDate) {
            throw new HttpException('Ngày hẹn không hợp lệ. Vui lòng chọn một ngày trong tương lai',HttpStatus.BAD_REQUEST);
          }
          const existingHospital = await this.prismaService.hospitals.findUnique({
            where: { id: hospitalId },
          });
          const existingAppointment = await this.prismaService.appointments.findFirst({
            where: {
                userId,
                status:"Booked"
            },
        });
          if (existingAppointment) {
              throw new HttpException(`Bạn đã có lịch đặt khám vào ngày ${existingAppointment.estimated.getDate()}`, HttpStatus.BAD_REQUEST);
          }
          if (!existingHospital) {
            throw new Error('Mã bệnh viện không hợp lệ.');
          }
          
          const existingAppointmentsCount = await this.prismaService.appointments.count({
            where: {
              date: isoDate,
              hospitalId,
            },
          });
      
          const orderNumber = existingAppointmentsCount === 0 ? 1 : existingAppointmentsCount + 1;
          const baseTime = new Date(`${date}T8:00:00`);
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
            throw new Error('Tính toán ngày không hợp lệ');
          }
        } catch (error) {
          if (error instanceof HttpException) {
            throw error; 
          } else {
            throw new HttpException('Đã xảy ra lỗi khi tạo cuộc hẹn.', HttpStatus.INTERNAL_SERVER_ERROR);
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
                  name: true,
                  hospitalSpecialization: {
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
            throw new NotFoundException(`Không tìm thấy cuộc hẹn cho người dùng có ID ${userId}`);
          }
      
          const estimatedTime = new Date(appointment.estimated);
          estimatedTime.setHours(estimatedTime.getHours() - 7);
          appointment.estimated = estimatedTime;
          const endTime = new Date(appointment.endTime);
          endTime.setHours(endTime.getHours() - 7);
          appointment.endTime = endTime;
        
          appointment.date = new Date(appointment.date);
          formatAppointmentDates(appointment);
          return appointment;
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          } else {
            throw new HttpException('Đã xảy ra lỗi khi truy xuất thông tin cuộc hẹn.', HttpStatus.INTERNAL_SERVER_ERROR);
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
          throw new NotFoundException(`Không tìm thấy cuộc hẹn cho người dùng có ID ${hospitalId}`);
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
          throw new NotFoundException(`Người dùng có ID ${Id} không được tìm thấy`);
        }
        throw new successException("Xóa cuộc hẹn thành công");
      }

      

      async updateAppointment(id: number): Promise<Appointments | null> {
        const updatedUser = await this.prismaService.appointments.update({
          where: { id: Number(id) },
          data:{ status: 'Booked' }
        });
    
        if (!updatedUser) {
          throw new NotFoundException(`Không tìm thấy cuộc hẹn với ID ${id}`);
        }
        return updatedUser;
      }

    
}
