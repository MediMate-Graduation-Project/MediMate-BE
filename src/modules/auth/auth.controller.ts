import { Controller, Post, Body,ValidationPipe ,UsePipes, HttpStatus, Res, UnauthorizedException, Req, UseGuards, Get, Logger} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as ExpressResponse ,Request as ExpressRequest} from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RequestWithUser, SanitizedUser } from './types';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Role } from 'src/commons/constants/role.enum';
import { ROLES } from './decorator/role.decorator';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/commons/constants/token';
@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name)
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
   register(@Body() body:RegisterDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req:RequestWithUser, @Res() res: ExpressResponse) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(req.user);
      this.setCookies(res, accessToken, refreshToken);
      res.status(HttpStatus.OK).end('Đăng nhập thành công.');
    } catch (error) {
      this.logger.error(error)
      res.status(HttpStatus.UNAUTHORIZED).end('LĐăng nhập không thành công.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ROLES(Role.User,Role.Hospital)
  @Get('profile')
  async getProfile(@Req() req:RequestWithUser):Promise<SanitizedUser>{
    return req.user
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req:RequestWithUser,@Res() res: ExpressResponse) {
    try {
      await this.authService.logout(req.user)
      this.clearCookies(res);
      res.status(HttpStatus.OK).end('Đăng xuất thành công.');
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end('Đăng xuất không thành công.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Res() res: ExpressResponse, @Req() req:RequestWithUser) {
    try {
      const accessToken  = await this.authService.refreshToken(req.user);
      res.cookie(ACCESS_TOKEN_KEY, accessToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 3600000) });
      res.status(HttpStatus.OK).end('RefreshToken thành công. ');
    } catch (error) {
        res.status(HttpStatus.BAD_REQUEST).end('Đã xảy ra lỗi khi cố gắng cập nhật RefeshToken');
      }
    
  }

  private setCookies(res: ExpressResponse, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 3600000) });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 14400000) });
  }

  private clearCookies(res: ExpressResponse) {
    res.clearCookie(ACCESS_TOKEN_KEY);
    res.clearCookie(REFRESH_TOKEN_KEY);
  }
  
}
