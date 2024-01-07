
import { Injectable, ConflictException, NotFoundException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { successException } from '../../commons/Exception/succesExeption';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()   
export class AuthService {

    constructor(private prismaService : PrismaService) {}
      
    async register(registerDto: RegisterDto)  {
        // const { phoneNumber, password } = registerDto;
        // const existingUser = await this.prismaService.findOne({
        //   where: { phoneNumber },
        // });
        // if (existingUser) {
        //   throw new ConflictException('User already exists');
        // }
        const hashedPassword = await bcrypt.hash(registerDto.password,10);
        const newUser = await this.prismaService.users.create({
            data: {
                phoneNumber: registerDto.phoneNumber,
                password: hashedPassword,
                status: 'active',
                role: 'user',
                createdAt: new Date(), // Set createdAt to the current date and time
                updatedAt: null, // Set updatedAt to null or provide a default value if needed
                address: null, // Set default value for address
                name: null, // Set default value for name
                gender: null, // Set default value for gender
                birthDate: null, // Set default value for birthDate
                image: null, // Set default value for image
                refreshToken: null, // Set default value for refreshToken
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
