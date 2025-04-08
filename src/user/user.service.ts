import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable() //可注入的 ,NestJS 会自动解析这些依赖，并在实例化该类时将其注入。
export class UserService {

    constructor(
        @InjectRepository(User) //注入 User 实体的 Repository对象
        private userRepository: Repository<User>,
    ) { }


    async create(user: any): Promise<User>    {
        return await this.userRepository.save(user); 
    }
}
