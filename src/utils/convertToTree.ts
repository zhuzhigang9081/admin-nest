import { Menu } from 'src/menu/entities/menu.entity';
export interface TreeNode extends Menu {
  name?: string;
  meta?: {
    title: string;
    cache: number;
    status: Boolean;
    name: string;
    hidden?: Boolean;
  };
  children?: TreeNode[];
}
export const convertToTree = (
  menuList: TreeNode[],
  parentId: number | null = null,
) => {
  const tree = [];

  for (let i = 0; i < menuList.length; i++) {
    //将path首字母大写并赋值给name ,作用是匹配对应的路由name属性 达到缓存路由的目的
    menuList[i].name = menuList[i].path.replace(
      menuList[i].path[0],
      menuList[i].path[0].toUpperCase(),
    );
    if (!menuList[i].meta) {
      menuList[i].meta = {
        title: menuList[i].title,
        cache: menuList[i].cache,
        status: !menuList[i].status,
        name: menuList[i].name,
      };
    }
    if (menuList[i].parent_id === parentId) {
      const children = convertToTree(menuList, menuList[i].id);
      if (children.length) {
        menuList[i].children = children;
      }
      tree.push(menuList[i]);
    }
  }

  return tree;
};
