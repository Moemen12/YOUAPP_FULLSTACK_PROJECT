import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { HeaderData } from '@shared/types';
import { MessagePattern } from '@nestjs/microservices';
import { UserProfileDto } from '@shared/dtos/user-update.dto';
import { RegisterUserDto } from '@shared/dtos/user-register.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get-user-profile' })
  async getUserInfo(headerData: HeaderData) {
    return await this.userService.getUserInfo(headerData);
  }

  @MessagePattern({ cmd: 'update-user-profile' })
  async updateUserProfile({
    headerData,
    profileData,
  }: {
    headerData: HeaderData;
    profileData: UserProfileDto;
  }) {
    console.log(profileData.profile_image.mimeType);
    return await this.userService.updateUserProfile({
      headerData,
      profileData,
    });
  }

  @MessagePattern({ cmd: 'createUser' })
  async createUser(userData: RegisterUserDto) {
    return await this.userService.createUser(userData);
  }

  @MessagePattern({ cmd: 'findUserByEmail' })
  async findUserByEmail(email: string) {
    return await this.userService.findUserByEmail(email);
  }

  @MessagePattern({ cmd: 'get-registered-users' })
  async getRegisteredUsers(userId: string) {
    return await this.userService.getAllUsers(userId);
  }

  @MessagePattern({ cmd: 'get-users-by-ids' })
  async getUsersByIds(userIds: string[]) {
    return await this.userService.getUsersByIds(userIds);
  }

  @MessagePattern({ cmd: 'get-profile-url' })
  async getProfileUl(userId: string) {
    return await this.userService.getProfileUrl(userId);
  }
}
