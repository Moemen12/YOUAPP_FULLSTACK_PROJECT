import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteUserDto } from '@shared/dtos/delete-account.dto';
import { HeaderData } from '@shared/types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatClient {
  constructor(
    @Inject('CHAT_SERVICE') private readonly chatClient: ClientProxy,
  ) {}

  async deleteAllChats(headerData: HeaderData, target: DeleteUserDto) {
    return await lastValueFrom(
      this.chatClient.send({ cmd: 'delete-all-chats' }, { headerData, target }),
    );
  }
}
