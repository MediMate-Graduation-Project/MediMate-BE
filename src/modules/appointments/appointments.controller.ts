import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';


@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('book')
  async bookAppointment(
    @Body(new ValidationPipe()) dto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.bookAppointment(dto);
    return { appointment };
  }
}
