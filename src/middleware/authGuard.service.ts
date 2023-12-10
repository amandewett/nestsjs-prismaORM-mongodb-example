import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from "@nestjs/core";
import { UserService } from "../modules/user/user.service";
import { Roles } from "src/enums/enums";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);
        const request: Request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );

            if (this.validateRoles(roles, payload.role)) {
                const userDetails: any = await this.userService.getUserDetails(payload.id);
                if (userDetails.status) {
                    const userData: User = userDetails.result;
                    request['user'] = userData;
                    return true;
                }
                else {
                    throw new UnauthorizedException();
                }
            }
            else {
                throw new UnauthorizedException();
            }
        }
        catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private validateRoles(roles: string[], userRoles: string[]) {
        return roles.some(role => userRoles.includes(role));
    }
}