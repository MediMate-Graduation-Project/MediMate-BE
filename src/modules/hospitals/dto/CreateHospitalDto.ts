// auth/dto/register.dto.ts
import { IsNotEmpty } from 'class-validator';


export class CreateHospitalDto {

    @IsNotEmpty({ message: 'hospitalName is required' })
    hospitalName: string;

    @IsNotEmpty({ message: 'industryCode is required' })
    industryCode: number;
  
    @IsNotEmpty({ message: 'hospitalType is required' })
    hospitalType: string;

    @IsNotEmpty({ message: 'address is required' })
    address: string;
}

  