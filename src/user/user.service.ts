import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    sayHi(): string {
        return "Hello World !!!!"
    }

    async createUser(user: any): Promise<User>    {
        return await this.userRepository.save(user); 
    }
    async getAllUser (): Promise<User[]> {
        return await this.userRepository.find();
    }
}
