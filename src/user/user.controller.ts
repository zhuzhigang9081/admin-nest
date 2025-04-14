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
} from '@nestjs/common';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

import { CacheService } from 'src/cache/cache.service';
import { ApiOperation, ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserVo } from './vo/create-user.vo';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) { }

  // @ApiBearerAuth() //添加认证之后才能方法
  @ApiOperation({
    summary: '注册',// 接口描述信息
  })
  @ApiOkResponse({
    description: '返回示例',// 响应描述信息
    type: CreateUserVo
  })
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
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }


  // @Get('findAll')
  // getAllUser() {
  //   return this.userService.getAllUser();
  // }

  // @Get('/set')
  // setVal() {
  //   return this.cacheService.set('age', '18')
  // }
  // @Get('/get')
  // getVal() {
  //   return this.cacheService.get('age')
  // }
}
