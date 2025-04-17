import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, Length } from 'class-validator'
export class CreateUserDto {
    @IsNotEmpty({
        message: "用户名不能为空",
    })
    @ApiProperty({
        example: "admin",
        description: "用户名",
    })
    username: string;
    @IsNotEmpty({
        message: "密码不能为空",
    })
    @MinLength(6, {
        message: "密码不能少于6位",
    })
    @ApiProperty({
        example: "123456",
        description: "密码",
    })
    password: string;

    @ApiProperty({
        example: "934e51cfff7b71ffc8ea",
        description: "验证码id",
    })
    id: string;

    @ApiProperty({
        example: "34y6",
        description: "验证码",
    })
    @Length(4, 4, { message: '验证码长度必须为4位' })
    captcha: string
}
