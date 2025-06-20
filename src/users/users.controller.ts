import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/signin.dto';
import { UpdateUserDTO } from './dto/update.dto';

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
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() userData: UpdateUserDTO) {
    // console.log('Received userData:', userData);
    return this.userService.updateUser(id, userData);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
