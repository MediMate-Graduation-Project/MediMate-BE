import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users } from '.prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}
    async getAllUsers(): Promise<Users[]> {
        return this.prismaService.users.findMany();
      }
    
      async getUserById(id: number): Promise<Users | null> {
        return this.prismaService.users.findUnique({
          where: {
            id
        },
        });
      }
    
      async updateUser(id: number, data: Partial<Users>): Promise<Users | null> {
        return this.prismaService.users.update({
          where: {
            id
          },
          data,
        });
      }
    
      async deleteUser(id: number): Promise<void> {
        const user = await this.prismaService.users.delete({
          where: {
            id
          },
        });
    
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
    
}
