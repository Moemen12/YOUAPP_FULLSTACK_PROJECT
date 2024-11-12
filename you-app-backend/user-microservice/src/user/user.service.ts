import { HttpStatus, Injectable } from '@nestjs/common';
import { HeaderData } from '@shared/types';
import {
  throwCustomError,
  RethrowGeneralError,
  saltAndHashPassword, // Import your hashing utility
} from '@shared/utilities/general-functions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserProfileDto } from '@shared/dtos/user-update.dto';
import { UploadthingService } from 'src/uploadthing/uploadthing.service';
import { User } from 'src/schema/user.schema';
import { RegisterUserDto } from '@shared/dtos/user-register.dto'; // Import the DTO

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly uploadThingService: UploadthingService,
  ) {}

  async getUserInfo({ userId }: HeaderData) {
    try {
      const user = await this.userModel
        .findById(userId)
        .lean()
        .select('-password -_id -createdAt -updatedAt -__v')
        .exec();

      if (!user) {
        throwCustomError('User not found', HttpStatus.UNAUTHORIZED);
      }

      const profileImageUrl = user.profileImage ? user.profileImage.url : null;

      return {
        ...user,
        profileImage: profileImageUrl,
      };
    } catch (error) {
      RethrowGeneralError(error);
    }
  }

  async updateUserProfile({
    headerData,
    profileData,
  }: {
    headerData: HeaderData;
    profileData: UserProfileDto;
  }) {
    const { userId } = headerData;

    try {
      const user = await this.userModel
        .findById(userId)
        .select('_id profileImage')
        .exec();
      if (!user) {
        throwCustomError('User not found', HttpStatus.UNAUTHORIZED);
      }

      if (profileData.profile_image) {
        const uploadedImage =
          await this.uploadThingService.UploadImageToUploadThing(
            profileData.profile_image,
          );
        if (user.profileImage?.key) {
          await this.uploadThingService.deleteImageFromUploadThing(
            user.profileImage.key,
          );
        }

        user.profileImage = {
          url: uploadedImage.url,
          key: uploadedImage.key,
          mimetype: profileData.profile_image.mimeType,
          size: profileData.profile_image.size,
        };
      }

      user.set({
        ...profileData,
        isUpdated: true,
        interestedIdeas: profileData.interestedIdeas,
      });

      await user.save();

      return {
        message: 'User profile updated successfully',
      };
    } catch (error) {
      if (error.status === 401) {
        throwCustomError('User not found', HttpStatus.UNAUTHORIZED);
      }
      RethrowGeneralError(error);
    }
  }

  // New createUser method
  async createUser(userData: RegisterUserDto) {
    try {
      // Check if the email is already taken
      const existingUser = await this.userModel
        .findOne({ email: userData.email })
        .exec();
      if (existingUser) {
        throwCustomError('Email is already registered', HttpStatus.CONFLICT);
      }

      const hashedPassword = await saltAndHashPassword(userData.password);

      const newUser = new this.userModel({
        ...userData,
        password: hashedPassword,
      });

      await newUser.save();

      return newUser;
    } catch (error) {
      RethrowGeneralError(error);
    }
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email }).exec(); // Adjust based on your actual user model
  }

  async getAllUsers(userId: string) {
    try {
      const users = await this.userModel.aggregate([
        { $match: { _id: { $ne: new Types.ObjectId(userId) } } },
        {
          $project: {
            receiver: '$_id',
            username: 1,
            imageUrl: '$profileImage.url',
          },
        },
      ]);

      if (!users) {
        throwCustomError('No users found', HttpStatus.UNAUTHORIZED);
      }

      return users;
    } catch (error) {
      RethrowGeneralError(error);
    }
  }

  async getUsersByIds(userIds: string[]) {
    try {
      return await this.userModel.aggregate([
        {
          $match: {
            _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
          },
        },
        {
          $project: {
            username: 1,
            profileImage: '$profileImage.url',
          },
        },
      ]);
    } catch (error) {
      RethrowGeneralError(error);
    }
  }

  async getProfileUrl(userId: string) {
    const user = await this.userModel.findById(userId).lean().exec();

    console.log(user);

    return user.profileImage?.url || null;
  }
}
