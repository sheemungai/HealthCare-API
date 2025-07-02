import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JWTPayLoad } from '../strategies/at.strategy';
import { Role } from 'src/users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators';

export interface UserRequest extends Request {
  user: JWTPayLoad;
}

export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<UserRequest>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const dbUser = await this.userRepository.findOne({
      where: { user_id: user.sub },
    });
    if (!dbUser) {
      throw new UnauthorizedException('User not found');
    }
    return requiredRoles.includes(dbUser.role);
  }
}
