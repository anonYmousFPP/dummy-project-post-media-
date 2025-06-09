import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { S3Service } from '../aws/s3.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  providers: [S3Service],
  controllers: [PostController],
})
export class PostModule {}