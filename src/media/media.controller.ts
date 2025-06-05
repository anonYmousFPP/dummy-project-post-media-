import { Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import { S3Service } from "../aws/s3.service";

@UseGuards()
@Controller('/media/profile')
export class MediaController {
    constructor(private readonly s3Service: S3Service){}

    @Get('/upload-url')
    async getUploadUrl(@Query('fileName') fileName: string, @Query('fileType') fileType: string){
        if (!fileName || !fileType) {
            throw new Error('fileName and fileType are required');
        }

        const url = await this.s3Service.generatePresignedUrl(fileName, fileType);
        return {url};
    }

    @Get('/profile-url')
    async getProfileUrl(@Query('fileName') fileName: string, @Req() req): Promise<string> {
        const userId = req.userId;
        if (!fileName) {
            throw new Error('fileName is required');
        }

        const url = await this.s3Service.generateDownloadUrl(userId,fileName);
        return url;
    }
}