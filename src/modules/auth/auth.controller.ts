import { Controller, Post, Body,ValidationPipe ,UsePipes, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
   register(@Body() body:RegisterDto) {
    return this.authService.register(body);
  }

}
