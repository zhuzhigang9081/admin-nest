import { Controller, Body, Post, Request, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create_menu.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiParam, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';

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

  @Post('/getInfo')
  @ApiOperation({ summary: '获取路由' })
  async getInfo(@Request() req) {
    return await this.menuService.getInfo(req);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('sys:role:list')
  @Post('/test')
  async test(@Request() req) {
    return 'success';
  }
}
