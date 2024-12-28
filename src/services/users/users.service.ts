import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { User } from 'src/entities/user.entity';

import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import { validateOrRejectUser } from 'src/common/utils/userFormValidator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject() private readonly jwtService: JwtService,
  ) {}

  async createUser(userData): Promise<User> {
    const user = new User();
    user.username = userData.username;
    user.email = userData.email;
    user.password = userData.password;
    user.profile_pic = userData.profile_pic;
    user.account_type = userData.account_type ?? 'PRIVATE';
    user.created_At = new Date();

    await validateOrRejectUser(user); // Added await

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user.password = hashedPassword;

    return this.userRepository.save(user);
  }

  async loginUser(userData) {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });

    if (!user) {
      throw new HttpException(
        `No user found with email: ${userData.email}!`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isValid = await bcrypt.compare(userData.password, user.password);

    if (!isValid) {
      throw new HttpException('Invalid password!', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return {
      message: `Login successfull, welcome ${user.username}!`,
      user,
      token,
    };
  }

  async UpdateUser(userData): Promise<User> {
    const user = await this.userRepository.findOne(userData.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.username = userData.username;
    user.email = userData.email;
    user.profile_pic = userData.profile_pic;

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      user.password = hashedPassword;
    }

    await validateOrRejectUser(user);
    return this.userRepository.save(user);
  }

  async deleteUser(user_id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.delete(user_id);
  }
}
