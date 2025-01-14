/* eslint-disable prettier/prettier */
import { IsBoolean, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserSignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
