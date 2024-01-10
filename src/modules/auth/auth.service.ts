
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

    constructor(
      private prismaService : PrismaService,
      private jwtService: JwtService,
      private configService: ConfigService
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

      async login(loginDto: LoginDto) {
        const user = await this.usersRepository
          .createQueryBuilder('user')
          .where('user.phoneNumber = :phoneNumber', { phoneNumber: loginDto.phoneNumber })
          .getOne();
        if (!user) {
          throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
        
        const refreshToken = await this.generateRefreshToken();
        user.refreshToken = refreshToken; // Update user's refreshToken
        await this.usersRepository.save(user);
      
        const accessToken = await this.generateAccessToken(user); // Use the updated refreshToken here
        return { accessToken, refreshToken };
      }

      private async generateAccessToken(user: Users) {
        if (!user.role || !user.role.nameRole) {
          throw new Error('User role information is missing');
        }
        const payload = { id: user.id,
          phoneNumber: user.phoneNumber,
          name: user.name,
          role: user.role.nameRole,
          refreshToken: user.refreshToken,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN'),
        });
        return accessToken;
      }
    
      private async generateRefreshToken(): Promise<string> {
        const refreshToken= await this.jwtService.signAsync({}, {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });
        return refreshToken;
      }
}
