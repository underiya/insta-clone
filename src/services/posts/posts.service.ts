import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/entities/post.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly jwtService: JwtService,
  ) {}

  async createPost(postData: Post, file: any, header: any): Promise<Post> {
    const token = header.authorization.split(' ')[1];
    const payload = await this.jwtService.verify(token, {
      secret: process.env.JWT_SECRETKEY,
    });
    const post = new Post();
    post.title = postData.title;
    post.user = payload.id;
    post.media = file.map((f) => f.filename);
    post.comment = [];
    post.likes = 0;
    post.share = '';
    post.created_at = new Date();
    return await this.postRepository.save(post);
  }

  async updatePost(id: number, post: Partial<Post>): Promise<void> {
    await this.postRepository.update(id, post);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async deletePostById(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async AllPosts(): Promise<Post[] | string> {
    // return 'all posts';
    return await this.postRepository.find();
  }

  async getPostById(id: number): Promise<Post> {
    return await this.postRepository.findOne({ where: { id } });
  }
}
