// auth/dto/register.dto.ts
import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';


export class RegisterDto {
  
    @IsNotEmpty()
    phoneNumber: number;
  
    @IsNotEmpty()
    @Length(8, undefined, { message: 'Password must be at least 8 characters' })
    password: string;
  }
  