
import { Injectable, ConflictException, NotFoundException, Res, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { Users } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { successException } from 'src/commons/Exception/succesExeption';

@Injectable()   
export class AuthService {

    constructor(
      private prismaService : PrismaService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
      ) {}
      
    async register(registerDto: RegisterDto)  {
        const { phoneNumber } = registerDto;
        const existingUser = await this.prismaService.users.findUnique({
          where: {phoneNumber},
        }) as Users;
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

      async login(loginDto: LoginDto) {
        const user = await this.prismaService.users.findUnique({
          where: { phoneNumber: loginDto.phoneNumber },
          select: { 
            id: true,
            createdAt: true,
            updatedAt: true,
            phoneNumber: true,
            password: true,
            address: true,
            name: true,
            gender: true,
            role: true,
            birthDate: true,
            status: true,
            image: true,
            refreshToken: true,},
        });
    
        if (!user) {
          throw new HttpException('User does not exist', HttpStatus.UNAUTHORIZED);
        }
    
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        const refreshToken = await this.generateRefreshToken(user);
        
        await this.prismaService.users.update({
          where: { id: user.id },
          data: { refreshToken },
        });
    
        const accessToken = await this.generateAccessToken(user);
    
        return { accessToken , refreshToken };
      }
    
      async logout(refreshToken: string) {
        const decodedToken = this.jwtService.decode(refreshToken) as { id: number };
        const user = await this.prismaService.users.findUnique({
          where: { id: decodedToken.id },
          select: { refreshToken: true },
        });
      
        if (user && user.refreshToken) {
          return this.prismaService.users.update({
            where: { id: decodedToken.id },
            data: { refreshToken: null },
          });
        } else {
          throw new UnauthorizedException('Invalid refreshToken');
        }
      }


    // auth.service.ts
    async refreshToken(refreshToken: string) {
      try {
        const decodedToken = this.jwtService.decode(refreshToken) as { id: number };
        const user = await this.prismaService.users.findUnique({
          where: { id: decodedToken.id },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            phoneNumber: true,
            password: true,
            address: true,
            name: true,
            gender: true,
            role: true,
            birthDate: true,
            status: true,
            image: true,
            refreshToken: true,
          },
        });

        if (user && user.refreshToken === refreshToken && !this.isTokenExpired(refreshToken)) {
          const newAccessToken = await this.generateAccessToken(user);
          return { accessToken: newAccessToken };
        } else {
          throw new UnauthorizedException('Invalid or expired refreshToken');
        }
      } catch (error) {
        // Handle token decoding or database lookup errors
        throw new UnauthorizedException('Invalid refreshToken');
      }
    }

    private isTokenExpired(token: string): boolean {
      const decodedToken = this.jwtService.decode(token, { json: true }) as { exp: number };
      return Date.now() >= decodedToken.exp * 1000;
    }


    private async generateAccessToken(user: Users): Promise<string> {
      const payload = {
          id: user.id,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('SECRET'),
          expiresIn: this.configService.get<string>('EXP_IN_ACCESS_TOKEN'),
        });
        return accessToken;
}
    
      private async generateRefreshToken(user: Users): Promise<string> {
        const payload = {
          id: user.id,
        };
        const refreshToken= await this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('SECRET'),
          expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
        });
        return refreshToken;
      }
}

