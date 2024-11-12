import { Injectable } from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';
import { UTApi } from 'uploadthing/server';
@Injectable()
@Injectable()
export class UploadthingService {
  private utapi: UTApi;

  constructor() {
    this.utapi = new UTApi();
  }

  async UploadImageToUploadThing(
    fileData: any,
  ): Promise<{ key: string; url: string }> {
    try {
      // Create buffer from the received data
      const buffer = Buffer.from(fileData.buffer);

      // Create a File object instead of Blob
      const file = new File([buffer], fileData.originalName || 'image.jpg', {
        type: fileData.mimeType || fileData.fileType?.mime || 'image/jpeg',
        lastModified: Date.now(),
      });

      // Log the file details for debugging
      console.log('Uploading file:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
      });

      // Upload to UploadThing
      const response = await this.utapi.uploadFiles([file]);
      const uploadedFile = response[0];

      if (!uploadedFile?.data) {
        throw new Error('Upload response is invalid');
      }

      console.log('Upload successful:', uploadedFile);

      return {
        key: uploadedFile.data.key,
        url: uploadedFile.data.url,
      };
    } catch (error) {
      console.error('UploadThing error:', error);
      throw new Error(
        `Failed to upload image to UploadThing: ${error.message}`,
      );
    }
  }

  async deleteImageFromUploadThing(key: string): Promise<void> {
    try {
      await this.utapi.deleteFiles(key);
    } catch (error) {
      console.error('Failed to delete image from UploadThing:', error);
      throw new Error(
        `Failed to delete image from UploadThing: ${error.message}`,
      );
    }
  }
}
