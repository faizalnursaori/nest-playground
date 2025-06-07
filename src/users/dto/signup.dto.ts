/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEmail, MinLength } from 'class-validator';

export class RegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
