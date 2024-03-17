// auth/dto/logout.dto.ts
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  
  refreshToken: string;
  userId: number;
}
