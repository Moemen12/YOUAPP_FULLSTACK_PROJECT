import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadthingModule } from 'src/uploadthing/uploadthing.module';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    UploadthingModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
