import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './common/configuration/configuration.module';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [ConfigurationModule, UserModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
