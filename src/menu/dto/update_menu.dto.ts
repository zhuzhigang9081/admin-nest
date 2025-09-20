import { IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class UpdateMenuDto {
    @IsOptional()
    @ApiProperty({
        example: '菜单1',
        required: false,
    })
    title: string;
    @IsNotEmpty({ message: 'id不可为空' })
    @ApiProperty({
        example: 1,
    })
    id: number
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
    })
    order_num: number;
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
    })
    parent_id?: number;
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
    })
    menu_type: number;
    @IsOptional()
    @ApiProperty({
        example: 'menu',
        required: false,
    })
    icon: string;
    @IsOptional()
    @ApiProperty({
        example: 'AA/BB',
        required: false,
    })
    component?: string;
    @IsOptional()
    @ApiProperty({
        example: 'BB',
        required: false,
    })
    path: string;
    @ApiProperty({
        example: 11,
    })
    update_by: number;
    @IsOptional()
    @ApiProperty({
        example: 'sys:post:list',
        required: false,
    })
    permission?: string;
}