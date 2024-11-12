import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RegisterUserDto } from '@shared/dtos/user-register.dto';
import { lastValueFrom } from 'rxjs';

export class UserClientService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async createUser(userData: RegisterUserDto) {
    return lastValueFrom(this.userClient.send({ cmd: 'createUser' }, userData));
  }

  async findUserByEmail(email: string) {
    return lastValueFrom(
      this.userClient.send({ cmd: 'findUserByEmail' }, email),
    );
  }
}
