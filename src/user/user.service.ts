import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository ,In} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create_user.dto';
import { LoginDto } from './dto/login.dto';
import { CacheService } from 'src/cache/cache.service';

import { ApiException } from 'src/common/filter/http-exception/api.exception';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';

import encry from '../utils/crypto'
import generateCaptcha from 'src/utils/generateCaptcha' //验证码生成器
import  { Role } from '../role/entities/role.entity'

@Injectable() //可注入的 ,NestJS 会自动解析这些依赖，并在实例化该类时将其注入。
export class UserService {

    constructor(
        @InjectRepository(User) //注入 User 实体的 Repository对象
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
        private jwtService: JwtService,
        private cacheService: CacheService

    ) { }


    async create(createUserDto: CreateUserDto) {
        const { username, password, captcha, id } = createUserDto;

        // 缓存验证码
        const cacheCaptcha = await this.cacheService.get(id)
        if (cacheCaptcha.toLowerCase() !== captcha.toLowerCase()) {
            throw new ApiException("验证码错误", ApiErrorCode.COMMON_CODE)
        }
        const exist = await this.userRepository.findOne({
            where: { username }
        })
        if (exist) {
            throw new ApiException("用户已存在", ApiErrorCode.USER_EXIST)
        }
        try {
            const newUser = new User()
            if(createUserDto.role_ids?.length){
                //查询需要绑定的角色列表(自动在关联表中生成关联关系)
                const roleList = await this.roleRepository.find({
                    where:{
                        id:In(createUserDto.role_ids)
                    }
                })
                newUser.roles = roleList
            }
            newUser.username = username;
            newUser.password = password;
            await this.userRepository.save(newUser)
            return "注册成功";

        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
        }



    }

    async login(loginDto: LoginDto) {
        const { username, password, id, captcha } = loginDto
        const cacheCaptcha = await this.cacheService.get(id)
        if (cacheCaptcha.toLowerCase() !== captcha.toLowerCase()) {
            throw new ApiException("验证码错误", ApiErrorCode.COMMON_CODE)
        }
        const user = await this.findOne(username)
        if (user.password !== encry(password, user.salt)) {
            throw new ApiException("密码错误", ApiErrorCode.PASSWORD_ERROE)
        }
        //payload 包含了用户的 username 和 id，这样在后续的请求中，服务器可以通过解码 JWT 来获取这些信息，而不需要再次查询数据库。
        const payload = { username: user.username, sub: user.id } //使用 sub 是一种约定俗成的做法,通常用它来存储用户的唯一标识符
        /*
        基于 payload 生成一个 JWT。
        客户端可以持有这个 JWT，并在后续请求中发送给服务器，服务器通过解码 JWT 来识别用户身份。
        服务器可以通过解码 JWT 来获取这些信息，而不需要再次查询数据库。
        */
        const token = await this.jwtService.signAsync(payload)
        this.cacheService.set(token, token, 7200)
        return token
        /*
        signAsync工作原理 : 输入：payload -> 加密:使用JwtModule 中配置的密钥（secret）对 payload 进行加密。 -> 输出：JWT 字符串
        */

    }
    /**
     * 生成验证码
     * @returns 验证码图片和验证码id
    */

    getCaptcha() {
        const { id, captcha } = generateCaptcha() //生成验证码
        this.cacheService.set(id, captcha.text, 600)
        return { id, img: captcha.data } //返回验证码id和验证码图片
    }


    async findOne(username: string) {
        const user = await this.userRepository.findOne({
            where: { username }
        })
        if (!user) {
            throw new ApiException("用户不存在", ApiErrorCode.USER_NOTEXIST)
        }
        return user
    }
    // getAllUser() {
    //     return this.userRepository.find()
    // }
}
