import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "../auth.service";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy  } from "@nestjs/passport";
import { Request } from "express";
import { JwtPayload, SanitizedUser } from "../types";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(private authService:AuthService,
                private configService:ConfigService,){
                function extractTokenFromCookie(request: Request): string | undefined {
                        const access_token = request.cookies['access_token'];
                        return access_token
                    }
                super({
                    jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromCookie]),
                    secretOrKey: configService.get<string>('SECRET')        
                })

    }

    async validate(payload:JwtPayload):Promise<SanitizedUser>{
        // console.log(payload)
        const user = await this.authService.validateJwtUser(payload)

        if(!user){
            throw new UnauthorizedException("không có jwt")
        }
        return user
    }
   
}