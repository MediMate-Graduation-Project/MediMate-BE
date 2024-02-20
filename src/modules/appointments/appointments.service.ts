import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';


@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) {}
    // async createAppointment(userId: number, date: Date, hospitalId: number) {
    //     // Logic để tạo số thứ tự và thời gian khám dự kiến
    //     const orderNumber = this.generateOrderNumber();
    //     const estimatedTime = this.generateEstimatedTime(date);
    
    //     // Lưu thông tin vào cơ sở dữ liệu bằng Prisma
    //     const createdAppointment = await this.prisma.appointments.create({
    //       data: {
    //         userId,
    //         date,
    //         hospitalId,
    //         orderNumber: orderNumber,
    //         estimated: estimatedTime,
    //       },
    //     });
    
    //     return createdAppointment;
    //   }
    
    //   private generateOrderNumber(): Number {
    //     // Logic để tạo số thứ tự, có thể sử dụng timestamp, UUID, hoặc bất kỳ phương pháp nào khác
    //     return 1;
    //   }
    
    //   private generateEstimatedTime(date: Date): Date {
    //     // Logic để tạo thời gian khám dự kiến, có thể sử dụng thư viện như date-fns hoặc Moment.js
    //     return new Date(date.getTime() + 2 * 60 * 60 * 1000); // Ví dụ: cộng thêm 2 giờ
    //   }
}
