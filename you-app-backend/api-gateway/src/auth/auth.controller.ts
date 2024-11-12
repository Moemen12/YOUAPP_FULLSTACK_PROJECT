import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterUserDto } from '@shared/dtos/user-register.dto';
import { LoginUserDto } from '@shared/dtos/user-login.dto';
import { ErrorShape } from '@shared/types/index';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authServiceProxy: ClientProxy) {}

  @Post('register')
  async register(
    @Body() registerData: RegisterUserDto,
  ): Promise<{ access_token: string } | ErrorShape> {
    return lastValueFrom(
      this.authServiceProxy.send({ cmd: 'register' }, registerData),
    );
  }

  @Post('login')
  async login(
    @Body() loginData: LoginUserDto,
  ): Promise<{ access_token: string } | ErrorShape> {
    return lastValueFrom(
      this.authServiceProxy.send({ cmd: 'login' }, loginData),
    );
  }
}
