import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [PostModule,
    ConfigModule.forRoot({
      envFilePath: '.env', // Path to your .env file
      isGlobal: true,      // Make config available globally
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
