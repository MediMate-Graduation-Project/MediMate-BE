import { Controller, Post, Body,ValidationPipe ,UsePipes, HttpStatus, Res, UnauthorizedException, Req} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }
  
}
