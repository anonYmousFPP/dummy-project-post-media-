import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [PostModule, 
    ConfigModule.forRoot({
      envFilePath: '.env', // Path to your .env file
      isGlobal: true,      // Make config available globally
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI as string)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
