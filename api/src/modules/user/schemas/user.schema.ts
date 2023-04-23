import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Profile, profileSchema } from './profile.schema';

@Schema({ timestamps: true })
export class User {
  _id: ObjectId;
  @Prop({ required: true, index: true, unique: true, trim: true })
  username: string;

  @Prop({
    required: true,
    index: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: profileSchema })
  profile?: Profile;

  @Prop()
  refreshToken?: string;

  @Prop({ default: Date.now() })
  createdAt?: Date;

  @Prop({ default: Date.now() })
  updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;
export const userSchema = SchemaFactory.createForClass(User);
