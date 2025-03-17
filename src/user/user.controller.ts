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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  sayHi(): string {
    return this.userService.sayHi();
  }
  @Post('usertest/:id')
  sayHi1(@Query() query: any, @Param() params: any, @Body() body: any): string {
    console.log(query, 'query');
    console.log(params, 'params');
    console.log(body, 'body');
    // return this.userService.sayHi();
    // throw new HttpException('您无权登录', HttpStatus.FORBIDDEN);
    throw new ApiException('用户不存在', ApiErrorCode.USER_NOTEXIST);
  }
}
