import { CanActivate, ExecutionContext, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CacheService } from 'src/cache/cache.service'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
    private cacheService: CacheService
  ) { }
  /**
   * 判断请求是否通过身份验证
   * @param context 执行上下文
   * @returns 是否通过身份验证
   */
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]) //获取元数据 isPublic 为 true 表示该路由是公开的，不需要进行身份验证。
    if (isPublic) { //如果是公开的，直接返回true
      return true; // 允许访问
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new HttpException("验证不通过", HttpStatus.FORBIDDEN)
    }
    const realToken = await this.cacheService.get(token) //从缓存中获取真正token
    try {

      const payload = await this.jwtService.verifyAsync(realToken, {
        secret: this.configService.get("JWT_SECRET") // 使用JWT_SECRET解析token
      })
      const { exp } = payload // 从payload中获取过期时间
      const nowTime = Math.floor(Date.now() / 1000) // 获取当前时间戳
      const isExpired = exp - nowTime < 3600
      // Token续期 如果token过期时间小于30秒，重新生成token并缓存
      if (isExpired) {
        const newPayload = { username: payload.username, sub: payload.sub }
        const newToken = await this.jwtService.signAsync(newPayload)
        this.cacheService.set(token, newToken, 7200)
      }
      request['user'] = payload // 将解析后的用户信息存储在请求对象中
    } catch (error) {
      throw new HttpException("验证不通过", HttpStatus.FORBIDDEN)
    }

    return true; // 身份验证通过
  }

  /**
   * 从请求头中提取token
   * @param request 请求对象
   * @returns 提取到的token
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [] // // 从Authorization头中提取token
    return type === "Bearer" ? token : undefined  // 如果是Bearer类型的token，返回token；否则返回undefined
  }
}
