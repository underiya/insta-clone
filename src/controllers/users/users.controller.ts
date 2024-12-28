import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/services/users/users.service';

export type loginUserHeaders = {
  email: string;
  password: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('Signup')
  async createUser(@Body() userData: User): Promise<User> {
    return this.usersService.createUser(userData);
  }

  @Get('login')
  async loginUser(@Headers() loginHeaders: loginUserHeaders) {
    return this.usersService.loginUser(loginHeaders);
  }
}
