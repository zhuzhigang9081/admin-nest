import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateMenuDto } from './dto/create_menu.dto';
import { FindMenuListDto } from './dto/find_menu.dto';
import { UpdateMenuDto } from './dto/update_menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { CacheService } from 'src/cache/cache.service';
import { GetInfoVo } from './vo/getInfo.vo';
import { filterPermissions } from 'src/utils/filterPermissions';
import { convertToTree } from 'src/utils/convertToTree';
import { roleToMenus } from 'src/utils/roleToMenu';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

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

    //菜单列表查询
    async findMenuList(findMenuListDto: FindMenuListDto, req) {
        const { user } = req
        const userList: User = await this.getUser(user, findMenuListDto)
        // console.log(userList, 'userList****')
        const menuList = roleToMenus(userList?.roles)
        // console.log(menuList, 'menuList****')
        const treeMenuList = convertToTree(menuList)
        //是否显示树形菜单 没有传title且菜单状态为开启时候才显示树形菜单
        const isShowTreeMenu = !findMenuListDto.title && (!findMenuListDto.status || findMenuListDto.status === 1)
        return isShowTreeMenu ? treeMenuList : menuList
    }

    //菜单修改
    async updateMenu(updateMenuDto: UpdateMenuDto) {
        try {
            await this.menuRepository.update(updateMenuDto.id,updateMenuDto)
            return '菜单修改成功'
        }catch (error) {
            throw new ApiException('菜单修改失败', 20000);
        }
    } 
    //菜单删除
    async deleteMenu(id:number | number[]){
        try {
            await this.menuRepository.delete(id)
            return '菜单删除成功'
        }catch (error) {
            throw new ApiException('菜单删除失败', 20000);
        }
    }
    //获取用户信息
    async getInfo(req): Promise<GetInfoVo> {
        const { user } = req
        //根据关联关系通过user查询user下的菜单和角色
        //TODO 学习一下这些方法
        const userList: User = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'role')
            .leftJoinAndSelect('role.menus', 'menu')
            .where({ id: user.sub })
            .orderBy('menu.order_num', 'ASC')
            .getOne()
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
                menuList: convertToTree(routers),
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
        routers = Object.values(menus)
        permissions = filterPermissions(routers);
        await this.cacheService.set(`${user.sub}_permissions`, permissions, 7200);

        return {
            menuList: convertToTree(routers),
            permissions
        }
    }
    async getUser(user, condition?: FindMenuListDto) {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'role')
                .leftJoinAndSelect('role.menus', 'menu')
                .where({ id: user.sub })

            if (condition?.title) {
                queryBuilder.andWhere('menu.title like :title', { title: `%${condition.title}%` })
            }
            if (condition?.status) {
                queryBuilder.andWhere('menu.status = :status', { status: condition.status })
            }
            queryBuilder.orderBy('menu.order_num', 'ASC')
            queryBuilder.getOne()
            const User = await queryBuilder.getOne()
            return User
        } catch (error) {
            throw new ApiException("查询失败", ApiErrorCode.COMMON_CODE)
        }
    }



}
