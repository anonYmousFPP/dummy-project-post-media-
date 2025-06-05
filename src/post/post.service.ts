import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { MediaType } from '../utils/media-type.utils';

interface createPostInterface {
  userId: string;
  type: MediaType;
  caption: string;
  tags: string[];
  mediaUrl: string;
  mediaKey: string;
}

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(postData: createPostInterface) {
    const createdPost = new this.postModel({
      ...postData,
      userId: new Types.ObjectId(postData.userId),
    });
    return createdPost.save();
  }

  async findById(id: string) {
    return this.postModel.findById(id).exec();
  }

  async deletePost(id: string) {
    const post = await this.postModel.findByIdAndDelete(id).exec();
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }
}