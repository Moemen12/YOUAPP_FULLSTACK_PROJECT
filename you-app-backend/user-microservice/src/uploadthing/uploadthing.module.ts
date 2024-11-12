import { Module } from '@nestjs/common';
import { UploadthingService } from './uploadthing.service';

@Module({
  providers: [UploadthingService],
  exports: [UploadthingService],
})
export class UploadthingModule {}
