import { SetMetadata } from '@nestjs/common';
//设置元数据 isPublic 为 true 表示该路由是公开的，不需要进行身份验证。
export const Public = () => SetMetadata('isPublic', true);
