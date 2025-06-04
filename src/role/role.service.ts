import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create_role.dto';
import { In, Repository } from 'typeorm';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { Role } from './entities/role.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<string> {
        const row = await this.roleRepository.findOne({
            where: { role_name: createRoleDto.role_name }
        })
        if (row) {
            throw new ApiException('角色已存在', ApiErrorCode.COMMON_CODE)
        }
        const newRole = new Role()
        if (createRoleDto.menu_ids?.length) {
            //查询包含menu_ids的菜单列表
            const menuList = await this.menuRepository.find({
                where: {
                    id: In(createRoleDto.menu_ids) //TODO  查一下 In where 等
                }
            })
            //赋值给newRole(插入表中之后会在关系表中生成对应关系)
            newRole.menus = menuList
        }
        try {
            await this.roleRepository.save({ ...createRoleDto, ...newRole })
            return '创建成功'
        } catch (error) {
            throw new ApiException("系统异常", ApiErrorCode.FAIL)
        }

    }
}