import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateMenuDto {
    @IsNotEmpty({ message: '菜单名称不能为空' }) //规定参数不能为空
    @ApiProperty({
        example: '菜单1',
    })
    title: string;
    @ApiProperty({
        example: 1,
        required: false,
    })
    order_num: number;
    @IsOptional() //规定参数可选
    parent_id?: number;
    @ApiProperty({
        example: 1,
    })
    menu_type: number;
    @ApiProperty({
        example: 'menu',
    })
    icon: string;
    @IsOptional()
    @ApiProperty({
        example: 'AA/BB',
        required: false,
    })
    component?: string;
    @IsNotEmpty({ message: '路由不能为空' })
    @ApiProperty({
        example: 'BB',
    })
    path: string;
    @ApiProperty({
        example: 11,
    })
    create_by: number;
    @IsOptional()
    @ApiProperty({
        example: 'sys:post:list',
        required: false,
    })
    permission?: string;
}