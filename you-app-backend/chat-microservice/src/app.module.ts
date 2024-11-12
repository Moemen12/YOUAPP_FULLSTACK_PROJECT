import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ChatModule,

    MessagesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
