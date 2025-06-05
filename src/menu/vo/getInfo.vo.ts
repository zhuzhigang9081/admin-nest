import { Menu } from '../entities/menu.entity';

export interface GetInfoVo {
  routers: Menu[];
  permissions: string[];
};