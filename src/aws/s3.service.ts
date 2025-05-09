import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { MediaType } from 'src/utils/media-type.utils';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly defaultExpiration = 3600;

  constructor(private readonly configService: ConfigService) {
    const awsRegion = this.getConfigValue('AWS_REGION');
    const awsAccessKey = this.getConfigValue('AWS_ACCESS_KEY');
    const awsSecretKey = this.getConfigValue('AWS_SECRET_KEY');
    this.bucketName = this.getConfigValue('AWS_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey,
      },
    });

    this.logger.log('S3Service initialized successfully');
  }

  private getConfigValue(key: string): string {
    const value = this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  generateFileKey(userId: string, originalName: string, type: MediaType): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `users/${userId}/${type}s/${timestamp}-${randomString}.${extension}`;
  }

  async generatePresignedPutUrl(
    key: string, 
    contentType: string,
    expiresIn: number = this.defaultExpiration
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async generatePresignedGetUrl(
    key: string,
    expiresIn: number = 86400 // 24 hours
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

}