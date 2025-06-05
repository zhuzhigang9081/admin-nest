import { SetMetadata } from '@nestjs/common';
//设置元数据  eg:@Permissions('system:user:add')
export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
