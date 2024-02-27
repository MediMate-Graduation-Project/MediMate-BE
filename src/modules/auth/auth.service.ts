
import { Injectable, ConflictException, NotFoundException, Res, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { Users } from '.prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/commons/constants/type';
import { JwtPayload, SanitizedUser } from './types';


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
                name:registerDto.name,
                password: hashedPassword,
              },
              select:{
                id:true,
                phoneNumber:true,
                name:true,
                createdAt:true
              }    
        });
        return newUser
      }

      async login(user: SanitizedUser) {
        const refreshToken = await this.generateRefreshToken(user);
        const accessToken = await this.generateAccessToken(user)
        await this.prismaService.users.update({
          where: { id: user.id },
          data: { refreshToken},
        });
        return {refreshToken,accessToken };
      }
    
      async logout(user: SanitizedUser) {
       const users =  await this.prismaService.users.update({
            where: { id: user.id },
            data: { refreshToken: null },
          });
          console.log(users)
          return users
        }    

    // auth.service.ts
    async refreshToken(user: SanitizedUser) {
      try {
        const users = await this.prismaService.users.findUnique({
          where: { id: user.id },
        });
        const newAccessToken = await this.generateAccessToken(users);
        return newAccessToken ;
      } catch (error) {
        throw new UnauthorizedException('Invalid refreshToken');
      }
    }
  
      private async generateAccessToken(user: SanitizedUser): Promise<string> {
        const payload:JwtPayload = {
          sub: user.id,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken
      }

      private async generateRefreshToken(user: SanitizedUser): Promise<string> {
        const payload:JwtPayload = {
          sub: user.id,
        };
        const refreshToken = await this.jwtService.signAsync(payload);
        return refreshToken
      }

      async validate(phoneNumber:string,password:string):Promise<SanitizedUser|null>{
        const user = await this.prismaService.users.findUnique({
          where: { phoneNumber },
        });
        console.log(user)
        if (!user) {
          throw new UnauthorizedException('User does not exist')
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const {id ,role} = user 
        return {id ,role}
      }

      async validateJwtUser(payload:JwtPayload):Promise<SanitizedUser|null>{
        const user = await this.prismaService.users.findUnique({where:{id:payload.sub}})
        if(!user){
          return null
        }
        const {id,role} = user 
        return {id,role}
      }
}

