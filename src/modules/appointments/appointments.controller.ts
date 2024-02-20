import { Controller, Post, Body } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // @Post()
  // async createAppointment(@Body() createAppointmentDto: { userId: number, date: Date, hospitalId: number }) {
  //   const { userId, date, hospitalId } = createAppointmentDto;
  //   const createdAppointment = await this.appointmentsService.createAppointment(userId, date, hospitalId);
  //   return createdAppointment;
  // }
}
