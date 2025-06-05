import { Menu } from 'src/menu/entities/menu.entity'
//将菜单列表中的permission字段提取出来，去重，返回一个数组
export function filterPermissions(routers: Menu[]): string[] {
    return [
        ...new Set(
            routers.map(router => router.permission)
                .filter(permission => permission !== null)
        )
    ]
}