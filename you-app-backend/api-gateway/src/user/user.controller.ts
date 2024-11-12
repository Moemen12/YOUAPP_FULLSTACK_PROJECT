import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HeaderData } from '@shared/types';
import { User } from '@shared/decorators/user.decorator';
import { UserProfileDto } from '@shared/dtos/user-update.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FormDataRequest } from 'nestjs-form-data';

@UseGuards(AuthGuard)
@Controller('profile')
export class UserController {
  constructor(@Inject('USER_SERVICE') private userServiceProxy: ClientProxy) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getUserProfile(@User() headerData: HeaderData) {
    return this.userServiceProxy.send({ cmd: 'get-user-profile' }, headerData);
  }

  @HttpCode(HttpStatus.OK)
  @Put()
  @FormDataRequest()
  async updateUserProfile(
    @User() headerData: HeaderData,
    @Body() profileData: UserProfileDto,
  ) {
    const serializedData = {
      ...profileData,
      profile_image: {
        buffer: profileData.profile_image.buffer,
        originalName: profileData.profile_image.originalName,
        encoding: profileData.profile_image.encoding,
        mimeType: (profileData.profile_image as any).busBoyMimeType,
        size: profileData.profile_image.size,
        fileType: (profileData.profile_image as any).fileType,
      },
    };

    return this.userServiceProxy.send(
      { cmd: 'update-user-profile' },
      { headerData, profileData: serializedData },
    );
  }
}
