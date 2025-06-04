import { Controller, Body ,Post} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create_role.dto';
import { Public } from 'src/public/public.decorator';

@Controller('role')
@ApiTags('角色模块')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }
  @Public()
  @ApiParam({
    name: 'CreateRoleDto',
    type: CreateRoleDto
  })
  @Post('createRole')
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto)
  }
}
