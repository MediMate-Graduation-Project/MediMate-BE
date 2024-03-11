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

  @Get('hospital/:hospitalId') 
  async getAppointmentByHospital(@Param('hospitalId') hospitalId: number): Promise<AppointmentCountDto[]> {
    return await this.appointmentsService.getAppointmentByHospital(hospitalId);
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
  async deleteAppointmentByUser(@Param('id') id: number  ): Promise<string> {
    return await this.appointmentsService.deleteAppointmentByUser(id);
  }

  @Delete('doctor/:hospitalId')
  async deleteAppointmentByDoctor(@Param('hospitalId') hospitalId: number  ): Promise<string> {
    return await this.appointmentsService.deleteAppointmentByDoctor(hospitalId);
  }
  @Get('actual-ordernumber/:hospitalId')
  async getActualOrderNumberHospital(@Param('hospitalId') hospitalId: number): Promise<number> {
    return await this.appointmentsService.getActualOrderNumberHospital(hospitalId);
  }
}
