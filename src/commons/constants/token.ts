import {  Res, Req} from '@nestjs/common';
import {Request as ExpressRequest} from 'express';

export function getRefreshTokenFromCookie(req: ExpressRequest) {
    return req.cookies['refresh_token'];
  }
  
export function getAccessTokenFromCookie(req: ExpressRequest) {
    return req.cookies['access_token'];
}