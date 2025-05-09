import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MediaType } from '../../utils/media-type.utils';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {

  @Prop({ enum: Object.values(MediaType) })
  type: string;

  @Prop({ maxlength: 2200, default: '' })
  caption: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ required: true })
  mediaUrl: string;

  @Prop()
  mediaKey: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);