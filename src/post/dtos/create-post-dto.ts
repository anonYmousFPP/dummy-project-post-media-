import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { MediaType } from 'src/utils/media-type.utils';

export class GenerateUploadUrlDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsEnum(MediaType, {
    message: `Type must be either ${MediaType.IMAGE} or ${MediaType.VIDEO}`
  })
  type: MediaType;
}

export class CompleteUploadDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsEnum(MediaType, {
    message: `Type must be either ${MediaType.IMAGE} or ${MediaType.VIDEO}`
  })
  type: MediaType;

  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}