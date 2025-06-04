import { Menu } from 'src/menu/entities/menu.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
@Entity('role')
export class Role {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;
    //角色名
    @Column({
        length: 20,
    })
    role_name: string;
    //排序
    @Column()
    role_sort: number;
    //角色状态 1启用 0禁用
    @Column({
        default: 1
    })
    status: number;
    //备注
    @Column({
        length: 100,
        nullable: true
    })
    remark: string;
    //创建人
    @Column({
        type: 'bigint'
    })
    create_by: number;
    //更新人
    @Column({
        type: 'bigint'
    })
    update_by: number;

    @CreateDateColumn()
    create_time: Date;
    @UpdateDateColumn()
    update_time: Date;

    @ManyToMany(type => Menu)
    @JoinTable({
        name: "fs_role_menu_relation"
    })
    menus: Menu[]
}