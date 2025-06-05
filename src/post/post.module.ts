import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { S3Service } from '../aws/s3.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schema/post.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }
    ]),
  ],
  providers: [PostService, S3Service],
  controllers: [PostController],
})
export class PostModule {}