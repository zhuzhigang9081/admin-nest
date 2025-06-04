import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { Role } from './entities/role.entity';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports:[TypeOrmModule.forFeature([Menu,Role])],
  exports:[TypeOrmModule.forFeature([Role])]
})
export class RoleModule {}
