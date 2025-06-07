import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { LoginDTO } from './dto/signin.dto';
import { RegisterDTO } from './dto/signup.dto';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDTO) {
    const hashedPassword = await hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
      },
    });
    return { id: user.id, email: user.email };
  }

  async login(data: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) return null;

    const isMatch = await compare(data.password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      },
    );

    return { token, user: { id: user.id, email: user.email } };
  }
}
