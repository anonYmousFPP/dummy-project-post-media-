import { Body, Controller, Post, Delete, NotFoundException } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { GetSignedUploadUrlsRequest, GetSignedUploadUrlsResponse, DeleteMediaRequest, DeleteMediaResponse } from 'src/stubs/media';
import { MediaService } from './media.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('media')
export class PostController {
  constructor(
    private readonly s3Service: S3Service,
    private readonly mediaService: MediaService, // Add MediaService
  ) {}

  @GrpcMethod('MediaService', 'GetSignedUploadUrls')
  async getSignedUploadUrls(@Body() request: GetSignedUploadUrlsRequest): Promise<GetSignedUploadUrlsResponse> {
    try {
      return await this.mediaService.getSignedUrlsInternal(request);
    } catch(error) {
      throw new NotFoundException('Error generating upload URL', error.message);
    }
  }

  @GrpcMethod('MediaService', 'DeleteMedia')
  async deleteMedia(@Body() request: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    try {
      return await this.mediaService.deleteMediaInternal(request);
    } catch(error) {
      throw new NotFoundException('Error deleting media', error.message);
    }
  }
}