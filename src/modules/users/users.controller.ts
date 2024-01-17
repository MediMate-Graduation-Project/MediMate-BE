import { Controller, Get, Param, Patch, Body, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '.prisma/client';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<Users[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Users | null> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<Users>): Promise<Users | null> {
    return this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
