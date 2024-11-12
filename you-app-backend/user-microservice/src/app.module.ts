import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadthingModule } from './uploadthing/uploadthing.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsFormDataModule, MemoryStoredFile } from 'nestjs-form-data';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    UserModule,
    UploadthingModule,
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
