import { Controller, Body, Get, Query, Post, Request, UseGuards, Delete, Param, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create_menu.dto';
import { UpdateMenuDto } from './dto/update_menu.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { ApiTags, ApiParam, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/common/guard/permissions.guard';
import { Permissions } from 'src/common/decorator/permissions.decorator';
import { FindMenuListDto } from 'src/menu/dto/find_menu.dto';

@Controller('menu')
@ApiTags('菜单权限模块')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }
  @Post('/createMenu')
  @Permissions('sys:menu:add')
  @ApiParam({
    name: 'createMenuDto',
    description: '菜单权限信息',
    type: CreateMenuDto,
  })
  @ApiOperation({ summary: '菜单管理-新增' }) //接口描述信息
  @ApiOkResponse({ description: '新增菜单成功' })
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.createMenu(createMenuDto)
  }

  //菜单修改
  @Put('/updateMenu')
  @Permissions('sys:menu:edit')
  @ApiParam({
    name: 'updateMenuDto',
    description: '菜单权限信息',
    type: UpdateMenuDto,
  })
  @ApiOperation({ summary: '菜单管理-修改' }) //接口描述信息
  @ApiOkResponse({ description: '修改菜单成功' })
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto) {
    return await this.menuService.updateMenu(updateMenuDto)
  }
  //菜单删除
  @Delete('/deleteMenu/:menuId')
  @Permissions('sys:menu:delete')
  @ApiParam({
    name: 'id',
    description: '菜单id',
    type: Number,
  })
  @ApiOperation({ summary: '菜单管理-删除' }) //接口描述信息
  @ApiOkResponse({ description: '删除菜单成功' })
  async deleteMenu(@Param('menuId') menuId: string) {
    return await this.menuService.deleteMenu(menuId.split(',').map(Number))
  }

  @Post('/getInfo')
  @ApiOperation({ summary: '获取路由' })
  async getInfo(@Request() req) {
    return await this.menuService.getInfo(req);
  }

  @Get('/list')
  @ApiParam({ name: 'findMenuListDto', type: FindMenuListDto })
  @ApiOperation({ summary: '获取菜单列表' })
  async list(@Query() findMenuListDto: FindMenuListDto, @Request() req) {
    return await this.menuService.findMenuList(findMenuListDto, req);
  }

  @UseGuards(PermissionsGuard)
  @Permissions('sys:role:list')
  @Post('/test')
  async test(@Request() req) {
    return 'success';
  }
}
