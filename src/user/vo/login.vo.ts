import { ApiProperty } from "@nestjs/swagger"

export class LoginVo {
    @ApiProperty({ example: "200", description: '状态码' })
    code: number;
    @ApiProperty({ example: "xxx" })
    data: string;
    @ApiProperty({ example: "请求成功" })
    description: string;
}