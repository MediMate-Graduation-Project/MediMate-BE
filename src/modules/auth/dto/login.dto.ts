import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;

  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}