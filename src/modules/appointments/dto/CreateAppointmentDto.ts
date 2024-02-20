import { IsDateString, IsInt } from "class-validator";

export class CreateAppointmentDto {
  @IsInt()
  userId: number;

  @IsInt()
  hospitalId: number;

  @IsDateString()
  date: string;
  }