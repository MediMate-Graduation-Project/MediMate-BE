import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users } from '.prisma/client';
import { successException } from 'src/commons/Exception/succesExeption';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllUsers(): Promise<Users[]> {
    return this.prismaService.users.findMany({where:{
      status:"ACTIVE"
    }});
  }

  
  async getUserById(id: number): Promise<Users | null> {
    const user = await this.prismaService.users.findUnique({
      where: {
        id : Number(id) ,
        status : "ACTIVE" },
    });
    if (!user) {
      throw new NotFoundException(`Người dùng với ID ${id} không được tìm thấy.`);
    }

    return user;
  }

  async updateUser(id: number, data: Partial<Users>): Promise<Users | null> {
    const updatedUser = await this.prismaService.users.update({
      where: { id: Number(id) },
      data,
    });

    if (!updatedUser) {
      throw new NotFoundException(`Người dùng với ID ${id} không được tìm thấy.`);
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    const deletedUser = await this.prismaService.users.update({
      where: { id: Number(id) },
      data: { status: "INACTIVE" }, 
    });

    if (!deletedUser) {
      throw new NotFoundException(`Người dùng với ID ${id} không được tìm thấy.`);
    }
    throw new successException("Đã xóa người dùng thành công");
  }
}
