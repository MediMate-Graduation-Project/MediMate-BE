import { Controller, Post, Body,ValidationPipe ,UsePipes, HttpStatus, Res, UnauthorizedException, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response as ExpressResponse ,Request as ExpressRequest} from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { getAccessTokenFromCookie, getRefreshTokenFromCookie } from 'src/commons/constants/token';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('register')
   register(@Body() body:RegisterDto) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: ExpressResponse) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(body);
      this.setCookies(res, accessToken, refreshToken);
      res.status(HttpStatus.OK).end('Logged in successfully');
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).end('Login failed');
    }
  }

  @Post('logout')
  async logout(@Res() res: ExpressResponse, @Req() req: ExpressRequest) {
    try {
      const accessToken = getAccessTokenFromCookie(req);
      if (!accessToken) {
        throw new UnauthorizedException('Access token not provided');
      }
      await this.authService.logout(accessToken);
      this.clearCookies(res);
      res.end('Signed out successfully');
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end('Logout failed');
    }
  }

  
  @Post('refresh')
  async refreshToken(@Res() res: ExpressResponse, @Req() req: ExpressRequest) {
    try {
      const refreshToken = getRefreshTokenFromCookie(req)

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not provided');
      }

      const newAccessToken = await this.authService.refreshToken(refreshToken);
      res.cookie('access_token', newAccessToken.accessToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 3600000) });
      res.end('Refresh token successfully');
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        res.status(HttpStatus.UNAUTHORIZED).end('The refresh token has expired or is invalid');
      } else {
        res.status(HttpStatus.BAD_REQUEST).end('Error trying to update access token');
      }
    }
  }


  private setCookies(res: ExpressResponse, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 10000) });
    res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 14400000) });
  }

  private clearCookies(res: ExpressResponse) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
  
}
