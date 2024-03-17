import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { format } from 'date-fns';
import { successException } from 'src/commons/Exception/succesExeption';

@Injectable()
export class DoctorsService {
    constructor(private readonly prismaService: PrismaService,
        ) {}


    async updateAppointmentByDoctor(hospitalId: number): Promise<string> {
        const currentDate = format(new Date(), "yyyy-MM-dd'T'00:00:00.000'Z'");
        const deletedAppointment = await this.prismaService.appointments.findFirst({
          where: { hospitalId: Number(hospitalId),
                   status: 'Booked',
                   date:currentDate
           },
        });
        
        if (!deletedAppointment) {
          throw new NotFoundException(`Hospital with ID ${hospitalId} not found`);
        }
       
        await this.prismaService.appointments.update({
          where: { id: Number( deletedAppointment.id) },
          data: {
            status: 'Unbook',
          },
        });
        throw new successException("delete user succesfull");
      }
}
