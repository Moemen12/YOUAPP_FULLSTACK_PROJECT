import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  HoroscopeSign,
  Zodiac,
  InterestedIdea,
  interestedIdeas,
  HOROSCOPE_SIGNS,
  uniqueChineseZodiacAnimals,
} from '@shared/constants';

@Schema({ timestamps: true })
export class Image {
  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  mimetype: string;

  @Prop({ type: Number, required: true })
  size: number;
}

const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, enum: ['Female', 'Male'] })
  gender: 'Female' | 'Male';

  @Prop({ type: Date })
  birthday: Date;

  @Prop({ type: String, enum: Object.values(uniqueChineseZodiacAnimals) })
  horoscope: HoroscopeSign;

  @Prop({ type: String, enum: Object.values(HOROSCOPE_SIGNS) })
  zodiac: Zodiac;

  @Prop({ type: Number, min: 50, max: 250 })
  height: number;

  @Prop({ type: Number, min: 20, max: 300 })
  weight: number;

  @Prop({ type: [String], enum: interestedIdeas, default: [] })
  interestedIdeas: InterestedIdea[];

  @Prop({ type: Boolean, default: false })
  isUpdated: boolean;

  // Single profile image for each user
  @Prop({ type: ImageSchema })
  profileImage?: Image;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
