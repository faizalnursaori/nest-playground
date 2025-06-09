import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDTO } from './dto/signup.dto';
import { UpdateUserDTO } from './dto/update.dto';
@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: RegisterDTO) {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        password: userData.password,
      },
    });
  }

  async getAllUser() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
