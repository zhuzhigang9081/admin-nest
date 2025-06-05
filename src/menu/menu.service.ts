import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateMenuDto } from './dto/create_menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { CacheService } from 'src/cache/cache.service';
import { GetInfoVo } from './vo/getInfo.vo';
import { filterPermissions } from 'src/utils/filterPermissions';
import { convertToTree } from'src/utils/convertToTree';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly cacheService: CacheService,

    ) { }

    async createMenu(createMenuDto: CreateMenuDto) {
        try {
            await this.menuRepository.save(createMenuDto);
            return '菜单新增成功'
        } catch (error) {
            throw new ApiException('菜单新增失败', 20000);
        }
    }

    async getInfo(req): Promise<GetInfoVo> {
        const { user } = req
        console.log(user.sub, 'sub****')
        //根据关联关系通过user查询user下的菜单和角色
        //TODO 学习一下这些方法
        const userList: User = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .leftJoinAndSelect('role.menus', 'menu')
            .where({ id: user.sub })
            .orderBy('menu.order_num', 'ASC')
            .getOne()
        console.log(userList, 'userList****')
        //是否是超级管理员,是的话查询所有菜单
        const isAdmin = userList.roles?.find((item) => item.role_name === 'admin')
        let routers: Menu[] = []
        let permissions: string[] = []
        if (isAdmin) {
            routers = await this.menuRepository.find({
                order: {
                    order_num: "ASC"
                },
                where: {
                    status: 1
                }
            })
            permissions = filterPermissions(routers)
            await this.cacheService.set(`${user.sub}_permissions`, permissions, null)
            return {
                routers: convertToTree(routers),
                permissions
            }
        }

        interface MenuMap {
            [key: string]: Menu;
        }

        //根据id去重
        const menus: MenuMap = userList.roles.reduce(
            (mergedMenus: MenuMap, role: Role) => {
                role.menus.forEach((menu: Menu) => {
                    mergedMenus[menu.id] = menu
                })
                return mergedMenus
            },
            {}
        )
        console.log(menus, 'menus****')
        routers = Object.values(menus)
        permissions = filterPermissions(routers);
        await this.cacheService.set(`${user.sub}_permissions`, permissions, 7200);

        return {
            routers: convertToTree(routers),
            permissions
        }
    }

}
