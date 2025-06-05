import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type MediaDocument = Media & Document;

@Schema({timestamps: true})
export class Media{
    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    userId: Types.ObjectId;

    @Prop({default: 'https://nestjs-uploader12.s3.eu-north-1.amazonaws.com/profilePics/default.jpg'})
    profilePic: string;

}
export const mediaSchema = SchemaFactory.createForClass(Media);