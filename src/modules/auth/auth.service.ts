
import { Injectable, ConflictException, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()   
export class AuthService {

    constructor(
      private prismaService : PrismaService,
      ) {}
      
    async register(registerDto: RegisterDto)  {
        const { phoneNumber } = registerDto;
        const existingUser = await this.prismaService.users.findUnique({
          where: {phoneNumber},
        });
        if (existingUser) {
          throw new ConflictException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(registerDto.password,10);
        const newUser = await this.prismaService.users.create({
            data: {
                phoneNumber: registerDto.phoneNumber,
                password: hashedPassword,
              },
              select:{
                id:true,
                phoneNumber:true,
                createdAt:true
              }    
        });
        return newUser
      }

     
}
