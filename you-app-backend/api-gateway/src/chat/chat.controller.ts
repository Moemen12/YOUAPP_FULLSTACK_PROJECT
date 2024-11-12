import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@shared/decorators/user.decorator';
import { HeaderData } from '@shared/types';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';

@UseGuards(AuthGuard)
@Controller()
export class ChatController {
  constructor(@Inject('CHAT_SERVICE') private chatServiceProxy: ClientProxy) {}
  @HttpCode(HttpStatus.OK)
  @Get('get-registered-user')
  async getAllChats(@User() headerData: HeaderData) {
    return lastValueFrom(
      this.chatServiceProxy.send({ cmd: 'get-all-users' }, headerData),
    );
  }

  @Get('/chats/view-chats')
  async getConnectedUsers(@User() headerData: HeaderData) {
    return lastValueFrom(
      this.chatServiceProxy.send({ cmd: 'view-connected-users' }, headerData),
    );
  }

  @Get('/chats/:userId')
  async getMessagesWith(
    @Param('userId') otherUserId: string,
    @User() { userId }: HeaderData,
  ) {
    return lastValueFrom(
      this.chatServiceProxy.send(
        { cmd: 'get_messages' },
        {
          senderId: userId,
          receiverId: otherUserId,
        },
      ),
    );
  }
  @Delete('delete-account')
  async deleteAccount(
    @User() headerData: HeaderData,
    @Body() target: DeleteUserDto,
  ) {
    return this.chatServiceProxy.send(
      { cmd: 'delete-account' },
      { headerData, target },
    );
  }

  @Delete('clear-chat')
  async clearUserChat(
    @User() headerData: HeaderData,
    @Body() target: DeleteUserDto,
  ) {
    return this.chatServiceProxy.send(
      { cmd: 'clear-chat-account' },
      { headerData, target },
    );
  }
}
