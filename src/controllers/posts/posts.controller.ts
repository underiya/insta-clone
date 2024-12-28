import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Post as PostEntity } from 'src/entities/post.entity';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { PostsService } from 'src/services/posts/posts.service';
import { diskStorage } from 'multer';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('media', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      //   limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  createPost(
    @Body() post: PostEntity,
    @UploadedFiles() files: Express.Multer.File[],
    @Headers() header: any,
  ) {
    if (!files) {
      console.log('No file uploaded');
      return 'No file uploaded';
    }

    const mediaData = files.map((file) => ({
      fileName: file.originalname,
      mimeType: file.mimetype,
      data: file.buffer, // Access file buffer for blob storage
    }));
    console.log(mediaData);
    // return 'create post';
    return this.postsService.createPost(post, files, header);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    console.log('findAll called');
    return this.postsService.AllPosts();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findById(@Param('id') id: number) {
    console.log('findById called with id:', id);
    return this.postsService.getPostById(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deletePost(@Param('id') id: number) {
    console.log('deletePost called with id:', id);
    return this.postsService.deletePostById(id);
  }
}
