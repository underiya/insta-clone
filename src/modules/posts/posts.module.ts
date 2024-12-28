import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from 'src/controllers/posts/posts.controller';
import { Post } from 'src/entities/post.entity';

import { PostsService } from 'src/services/posts/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, JwtService],
})
export class PostsModule {}
