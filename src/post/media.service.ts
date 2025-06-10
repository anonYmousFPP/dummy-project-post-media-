import { Injectable } from '@nestjs/common';
import { S3Service } from '../aws/s3.service';
import { GetSignedUploadUrlsRequest, GetSignedUploadUrlsResponse, DeleteMediaRequest, DeleteMediaResponse } from 'src/stubs/media';

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}

  // Internal method for other services to use
  async getSignedUrlsInternal(request: GetSignedUploadUrlsRequest): Promise<GetSignedUploadUrlsResponse> {
    const urls = await Promise.all(request.files.map(async (file) => {
      const fileKey = this.s3Service.generateMediaKey(file);
      const uploadUrl = await this.s3Service.generatePresignedPutUrl(fileKey);
      const publicUrl = this.s3Service.getPublicUrl(fileKey);

      return {
        fileKey,
        uploadUrl,
        publicUrl
      };
    }));

    return { urls };
  }

  // Internal method for other services to use
  async deleteMediaInternal(request: DeleteMediaRequest): Promise<DeleteMediaResponse> {
    const deletedFiles: string[] = [];
    const failedFiles: string[] = [];

    await Promise.all(request.files.map(async (file) => {
      try {
        await this.s3Service.deleteFile(file);
        deletedFiles.push(file);
      } catch (error) {
        failedFiles.push(file);
      }
    }));

    return {
      success: failedFiles.length === 0,
      deletedFiles,
      failedFiles
    };
  }
}