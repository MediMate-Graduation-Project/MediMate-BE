import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { error } from "console";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "./public.guard";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    constructor(private reflector:Reflector){
        super()
    }
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(isPublic){
            return true
        }
        return super.canActivate(context)
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if(err || !user){
            throw err || new UnauthorizedException("no user");
        }

        return user
    }
}
            // const request = context.switchToHttp().getRequest();
            // const token = this.extractTokenFromCookie(request);

// export class JwtAuthGuard implements CanActivate {
//     constructor(private jwtService: JwtService, private configService: ConfigService) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const token = this.extractTokenFromCookie(request);
//         if (!token) {
//             throw new UnauthorizedException();
//         }
//         try {
//             const payload = await this.jwtService.verifyAsync(token, {
//                 secret: this.configService.get<string>('SECRET')
//             });
//             request['user_data'] = payload;
//         } catch {
//             throw new HttpException({
//                 status: 419,
//                 message: "Token expired"
//             }, 419);
//         }
//         return true;
//     }

    // private extractTokenFromCookie(request: Request): string | undefined {
    //     return request.cookies['access_token']; 
    // }
// }
