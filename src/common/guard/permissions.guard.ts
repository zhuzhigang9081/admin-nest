// const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()])
//  const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler(),);

// getAllAndOverride 和 get的区别是 getAllAndOverride 会获取所有的元数据，而 get 只会获取第一个元数据 比如 判断isPublic 先从 方法上找 如果没有在从 类上找  而get 只会从 方法上找 如果没有就返回undefined

import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from 'src/cache/cache.service';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    //如果没有设置权限，直接放行
    if (!requiredPermissions) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    //从请求头中获取用户信息,user是在UserGuard中设置的
    const { user } = request;
    //解析出的是超级管理员直接放行
    if (user?.username === 'admin') {
      return true;
    }
    //从缓存中获取用户权限
    const userPermissions = await this.cacheService.get(
      `${user.sub}_permissions`,
    );
    //如果获取不到用户信息，或者用户没有权限，返回false
    if (!user || !userPermissions) {
      return false;
    }
    //判断用户是否拥有所需的权限
    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    return hasPermission;
  }
}
