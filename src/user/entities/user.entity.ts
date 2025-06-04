import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import encry from '../../utils/crypto'
import * as crypto from 'crypto'
import { Role } from "src/role/entities/role.entity";
/**
 * @Entity()，TypeORM 会默认使用类名作为数据库表的名称。默认情况下，类名会被自动转换为小写并用作表名
 * @Entity("user") 显式地指定了这个实体对应的数据库表名为 "user"
*/
@Entity("user")
export class User {
    @BeforeInsert()
    beforeInsert() {
        this.salt = crypto.randomBytes(4).toString("base64");
        this.password = encry(this.password, this.salt)
    }



    @PrimaryGeneratedColumn("uuid")
    id: number; // 自增的主键
    @Column({ length: 30 }) // @Column()用于将类的属性映射到数据库表的列
    username: string; // 用户名
    @Column({ nullable: true })
    nickname: string; // 昵称
    @Column()
    password: string; // 密码
    @Column({ nullable: true })
    avatar: string;//头像
    @Column({ nullable: true })
    email: string;//邮箱
    @Column({ nullable: true })
    role: string;//角色
    @Column({ nullable: true })
    salt: string;//盐
    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" }) //CURRENT_TIMESTAMP 是一个 SQL 函数，用于获取当前时间戳
    create_time: Date;
    @Column({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP" })
    update_time: Date;

    @ManyToMany(type=>Role)
    @JoinTable({name:"fs_user_role_relation"})
    roles: Role[]
}