import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/signin.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  async register(@Body() userData: RegisterDTO) {
    return this.userService.register(userData);
  }

  @Post('login')
  async login(@Body() userData: LoginDTO) {
    return this.userService.login(userData);
  }

  @Get()
  async getAllUser() {
    return this.userService.getAllUser();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
