// auth/dto/register.dto.ts
import { IsNotEmpty, Length } from 'class-validator';


export class RegisterDto {
  
    @IsNotEmpty({ message: 'PhoneNumber is required' })
    @Length(10 , undefined, { message: 'Phone number must have 10 or 11 digits' })
    phoneNumber: string;
  
    @IsNotEmpty({ message: 'password is required' })
    @Length(8, undefined, { message: 'Password must be at least 8 characters' })
    password: string;
}
  