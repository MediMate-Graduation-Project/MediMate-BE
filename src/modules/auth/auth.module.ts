import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalStrategy } from './strategies/local';
import { JwtStrategy } from './strategies/jwt';

@Module({ 
  imports: [
   PrismaModule , UsersModule ,JwtModule.registerAsync({
    inject:[
      ConfigService
    ],
    useFactory: async(configService:ConfigService) =>{
      return {
        secret: configService.get<string>('SECRET'),
        signOptions: {
          expiresIn:configService.get<string>('EXP_IN')
        }
      }
    }
   }),
  ],
  controllers: [AuthController],
  providers: [AuthService , LocalAuthGuard , JwtAuthGuard , LocalStrategy , JwtStrategy],
})
export class AuthModule {}
