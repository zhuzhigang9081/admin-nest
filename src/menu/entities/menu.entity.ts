import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;
  //标题
  @Column({
    length: 20,
  })
  title: string;
  //排序
  @Column()
  order_num: number;
  //父id
  @Column({
    nullable: true,
  })
  parent_id: number;
  //菜单类型 1目录 2菜单 3按钮
  @Column()
  menu_type: number;
  //菜单图标
  @Column({
    length: 50,
    nullable: true,
  })
  icon: string;
  // 组件路径
  @Column({
    length: 50,
    nullable: true,
  })
  component: string;
  //权限标识
  @Column({
    length: 50,
    nullable: true,
  })
  permission: string;
  //路由
  @Column({
    length: 50,
  })
  path: string;

  @Column({
    type: 'bigint',
  })
  create_by: number;
  //状态 1启用 0禁用
  @Column({
    default: 1,
  })
  status: number;
  //是否隐藏侧边菜单 1:隐藏 0:显示
  @Column({
    default: 0,
  })
  hidden: number;
  //状态 1:缓存 0:不缓存
  @Column({
    default: 0,
  })
  cache: number;
  @CreateDateColumn()
  create_time: Date;
  @UpdateDateColumn()
  update_time: Date;
}
