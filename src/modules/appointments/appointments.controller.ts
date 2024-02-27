import { Controller, Post,Get, Body, ValidationPipe, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Response as ExpressResponse } from 'express';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('user/:userId')
  async getAppointmentByUserId(@Param('userId') userId: number) {
      const appointment = await this.appointmentsService.getAppointmentsByUserId(userId);
      return appointment;
  }

  @Post('book')
  async bookAppointment(
    @Body(new ValidationPipe()) dto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.bookAppointment(dto);
    return { appointment };
  }
  
  @Delete(':id')
  async voiddeleteAppointment(@Param('id') id: number  ): Promise<string> {
    const deleteApointment = this.appointmentsService.deleteAppointment(id);
    return deleteApointment
  }
}
