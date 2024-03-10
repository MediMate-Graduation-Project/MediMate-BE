import { Controller, Post,Get, Body, ValidationPipe, Param, Delete, Res, HttpStatus, Query, Patch } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/CreateAppointmentDto';
import { Response as ExpressResponse } from 'express';
import { Appointments } from '@prisma/client';
import { AppointmentCountDto } from './dto/AppointmentCountDto ';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('user/:userId')
  async getAppointmentByUserId(@Param('userId') userId: number) {
      const appointment = await this.appointmentsService.getAppointmentsByUserId(userId);
      return appointment;
  }

  @Get('count/:hospitalId') 
  async countOrdersByDateAndHospital(@Param('hospitalId') hospitalId: number): Promise<AppointmentCountDto[]> {
    return await this.appointmentsService.findMaxOrderNumberByDateAndHospital(hospitalId);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number): Promise<Appointments | null> {
    return await this.appointmentsService.updateAppointment(id);
  }
  
  @Post('book')
  async bookAppointment(
    @Body(new ValidationPipe()) dto: CreateAppointmentDto,
  ) {
    const appointment = await this.appointmentsService.bookAppointment(dto);
    return { appointment };
  }
  
  @Delete(':id')
  async deleteAppointment(@Param('id') id: number  ): Promise<string> {
    return await this.appointmentsService.deleteAppointment(id);
  }
}
