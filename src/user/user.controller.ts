import {
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  Request,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { CreateUserVo } from './vo/create-user.vo';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';
import { UserGuard } from 'src/common/guard/user.guard';
import { Public } from 'src/common/decorator/public.decorator';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  // @ApiBearerAuth() //添加认证之后才能方法
  @ApiOperation({
    summary: '注册',// 接口描述信息
  })
  @ApiOkResponse({
    description: '返回示例',// 响应描述信息
    type: CreateUserVo
  })
  @Public() //使用public装饰器 跳过守卫,不进行鉴权
  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @ApiOperation({
    summary: '登录',// 接口描述信息
  })
  @ApiOkResponse({
    description: '返回示例',// 响应描述信息
    type: LoginVo
  })
  @Public()
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @ApiOperation({
    summary: '获取验证码',// 接口描述信息
  })
  @Public()
  @Get('captcha')
  getCaptcha() {
    return this.userService.getCaptcha()
   }

  // @UseGuards(UserGuard) // 单个接口使用守卫
  @Get('testGuard')
  async testGuard(@Req() req: any) {
    return 1
  }

}
