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
