import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class User {
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
}