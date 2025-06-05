import { Module } from "@nestjs/common";
import { MediaController } from "./media.controller";
import { S3Service } from "../aws/s3.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Media, mediaSchema } from "./media.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Media.name, schema: mediaSchema }]),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [MediaController],
    providers: [S3Service]
})

export class MediaModule{}