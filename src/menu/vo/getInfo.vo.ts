import { Menu } from '../entities/menu.entity';

export interface GetInfoVo {
  menuList: Menu[];
  permissions: string[];
};