import { CanActivate, ExecutionContext, ForbiddenException, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { error } from "console";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "./public.guard";
import { Role } from "src/commons/constants/role.enum";
import { ROLES_KEY } from "../decorator/role.decorator";

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
        
        const {user} = context.switchToHttp().getRequest()
        console.log(user);
        return super.canActivate(context)
    }

    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        if(err || !user){
            throw err || new UnauthorizedException("Không có người dùng");
        }
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(!requiredRoles){
            return user
        }

        if(!requiredRoles.some((role)=>user.role === role)) {
            throw new ForbiddenException(`Yêu cầu vai trò: ${requiredRoles}`);
          }
        return user
    }
}
          