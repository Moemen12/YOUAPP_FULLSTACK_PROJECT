import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { ErrorShape } from '@shared/types/index';
import { RegisterUserDto } from '@shared/dtos/user-register.dto';
import { LoginUserDto } from '@shared/dtos/user-login.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(
    registerData: RegisterUserDto,
  ): Promise<{ access_token: string } | ErrorShape> {
    return await this.authService.register(registerData);
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    loginData: LoginUserDto,
  ): Promise<{ access_token: string } | ErrorShape | any> {
    return await this.authService.login(loginData);
  }
}
