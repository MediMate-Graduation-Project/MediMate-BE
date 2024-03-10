import { Controller, Get, Param, Patch, Body, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from '.prisma/client';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<Users[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Users | null> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: number, @Body() data: Partial<Users>): Promise<Users | null> {
    return await this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
