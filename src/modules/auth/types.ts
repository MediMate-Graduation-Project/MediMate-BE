import { Request } from "express";

export interface RequestWithUser extends Request{
    user: SanitizedUser
}

export interface SanitizedUser {
    id: number,
    phoneNumber?:string,
    password?:string,
    role: string,
    refreshToken?: string,

}

export interface JwtPayload{
    sub: number ,
    iat?: number,
    exp?:number;
}