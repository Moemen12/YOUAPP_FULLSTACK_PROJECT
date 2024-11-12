import { HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '@shared/dtos/user-register.dto';
import { LoginUserDto } from '@shared/dtos/user-login.dto';
import * as bcrypt from 'bcryptjs';
import { ErrorShape } from '@shared/types/index';
import { Model } from 'mongoose';

import {
  throwCustomError,
  saltAndHashPassword,
  RethrowGeneralError,
} from '@shared/utilities/general-functions';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserClientService } from 'src/clients/user-client.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userClientService: UserClientService,
  ) {}

  async register({
    email,
    username,
    password,
  }: RegisterUserDto): Promise<{ access_token: string } | ErrorShape> {
    const existingUser = await this.userClientService.findUserByEmail(email);
    if (existingUser) {
      throwCustomError('Email is already registered', HttpStatus.CONFLICT);
    }

    // Create the user
    const userData: RegisterUserDto = { email, username, password }; // No hashing here; let the UserService handle it

    try {
      const user = await this.userClientService.createUser(userData);
      if (!user) {
        throwCustomError(
          'User could not be created',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Create JWT payload
      const payload = { userId: user._id.toString() };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      RethrowGeneralError(error);
    }
  }
  async login(
    loginData: LoginUserDto,
  ): Promise<{ access_token: string } | ErrorShape> {
    const user = await this.userClientService.findUserByEmail(loginData.email);

    if (!user) {
      throwCustomError(
        'No account associated with this email address.',
        HttpStatus.NOT_FOUND,
      );
    }

    const passwordMatched = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!passwordMatched) {
      throwCustomError('Incorrect Credentials', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = { userId: user._id.toString(), username: user.username };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
      };
    } catch (error) {
      RethrowGeneralError(error);
    }
  }
}
