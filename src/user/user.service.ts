import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    sayHi(): string {
        return "Hello World !!!!"
    }
}
