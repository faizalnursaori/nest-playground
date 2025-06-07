import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/signin.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  async register(@Body() userData: RegisterDTO) {
    // console.log(body);
    return this.userService.register(userData);
  }

  @Post('login')
  async login(@Body() userData: LoginDTO) {
    return this.userService.login(userData);
  }
}
