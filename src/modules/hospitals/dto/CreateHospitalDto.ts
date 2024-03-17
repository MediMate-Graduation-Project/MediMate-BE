// auth/dto/register.dto.ts
import { IsNotEmpty } from 'class-validator';


export class CreateHospitalDto {

    @IsNotEmpty({ message: 'hospitalName is required' })
    name: string;

    @IsNotEmpty({ message: 'industryCode is required' })
    industryCode: number;
  
    @IsNotEmpty({ message: 'hospitalType is required' })
    type: string;

    @IsNotEmpty({ message: 'address is required' })
    address: string;
}

  