import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SystemNotification } from '@shared/types';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: String, required: true })
  receiver: string;

  @Prop({ type: String, required: true })
  sender: string;

  @Prop({
    type: String,
    required: true,
    enum: ['MESSAGE', 'NOTIFICATION', 'CONNECTION'],
  })
  type: SystemNotification['type'];

  @Prop({ type: String })
  content: string;

  @Prop({ type: Boolean, default: false })
  isRead: boolean;

  // Add `createdAt` and `updatedAt` explicitly
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
