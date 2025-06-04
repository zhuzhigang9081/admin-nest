import { Controller, Body, Post, Request } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create_menu.dto';
import { Public } from 'src/public/public.decorator';
import { ApiTags, ApiParam, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@Controller('menu')
@ApiTags('菜单权限模块')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  @Post('/createMenu')
  @Public()
  @ApiParam({
    name: 'createMenuDto',
    description: '菜单权限信息',
    type: CreateMenuDto,
  })
  @ApiOperation({ summary: '新增菜单' }) //接口描述信息
  @ApiOkResponse({ description: '新增菜单成功' })
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.createMenu(createMenuDto)
  }

  @Post('/getRouters')
  @ApiOperation({ summary: '获取路由' })
  async getRouters(@Request() req) {
    return await this.menuService.getRouters(req);
  }
}
