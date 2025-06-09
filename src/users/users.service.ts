import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { LoginDTO } from './dto/signin.dto';
import { RegisterDTO } from './dto/signup.dto';
import { UpdateUserDTO } from './dto/update.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private userRepo: UserRepository,
  ) {}

  async register(data: RegisterDTO) {
    try {
      const existingUser = await this.userRepo.findByEmail(data.email);

      if (existingUser) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = await hash(data.password, 10);
      const user = await this.userRepo.createUser({
        ...data,
        password: hashedPassword,
      });

      return { message: 'Register Succes', id: user.id, email: user.email };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Register Error', error);
      throw new InternalServerErrorException(
        'Something went wrong when registering the user',
      );
    }
  }

  async login(data: LoginDTO) {
    try {
      const user = await this.userRepo.findByEmail(data.email);
      if (!user) throw new UnauthorizedException('Invalid Credentials');

      const isMatch = await compare(data.password, user.password);
      if (!isMatch) throw new UnauthorizedException('Invalid Credentials');

      const token = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: '1h' },
      );

      return {
        token,
        user: { id: user.id, email: user.email },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      console.error('Login Error', error);
      throw new InternalServerErrorException(
        'Something went wrong when logging in the user',
      );
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepo.getAllUser();
      return { users };
    } catch (error) {
      console.error('Error fetching users', error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching users',
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error fetching user with id: ${id}`, error);
      throw new InternalServerErrorException(
        'Something went wrong while fetching user',
      );
    }
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    try {
      if (userData.email) {
        const existingUser = await this.userRepo.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Email already exist');
        }
        return {
          message: 'No changes detected. User data remains the same.',
          data: existingUser,
        };
      }

      const user = await this.userRepo.findById(id);
      if (!user) throw new NotFoundException('User not Found');

      if (userData.password) {
        userData.password = await hash(userData.password, 10);
      }

      const updateUser = await this.userRepo.updateUser(id, userData);
      return updateUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error updating user with id ${id}`, error);
      throw new InternalServerErrorException(
        'Something went wrong while updating user',
      );
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) throw new NotFoundException('User not Found');

      const deleteUser = await this.userRepo.deleteUser(id);
      return {
        message: 'User deleted successfully',
        data: deleteUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(`Error deleting user with id ${id}`, error);
      throw new InternalServerErrorException(
        'Something went wrong while deleting user',
      );
    }
  }
}
