import { Body, Controller, Get, Post, Param, NotFoundException } from '@nestjs/common';
import { PostService } from './post.service';
import { S3Service } from '../aws/s3.service';
import { GenerateUploadUrlDto, CompleteUploadDto } from './dtos/create-post-dto';
import { MediaType } from 'src/utils/media-type.utils';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('upload-url')
  async generateUploadUrl(
    @Body() generateUploadUrlDto: GenerateUploadUrlDto
  ) {
    console.log('Received body:', generateUploadUrlDto);
    const type = generateUploadUrlDto.type.startsWith('image') ? MediaType.IMAGE : MediaType.VIDEO;
    const key = this.s3Service.generateFileKey(
      generateUploadUrlDto.userId,
      generateUploadUrlDto.fileName,
      type
    );

    const uploadUrl = await this.s3Service.generatePresignedPutUrl(
      key,
      generateUploadUrlDto.type
    );

    return { 
      uploadUrl,
      key,
      type 
    };
  }

  @Post('complete-upload')
  async completeUpload(
    @Body() completeUploadDto: CompleteUploadDto
  ) {
    const downloadUrl = await this.s3Service.generatePresignedGetUrl(completeUploadDto.key);
    
    const post = await this.postService.createPost({
      userId: completeUploadDto.userId,
      type: completeUploadDto.type,
      caption: completeUploadDto.caption || '',
      tags: completeUploadDto.tags || [],
      mediaUrl: downloadUrl,
      mediaKey: completeUploadDto.key,
    });

    return post;
  }

  @Get(':id/media-url')
  async getMediaUrl(@Param('id') postId: string) {
    const post = await this.postService.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    const mediaUrl = await this.s3Service.generatePresignedGetUrl(post.mediaKey);
    return { mediaUrl };
  }
}