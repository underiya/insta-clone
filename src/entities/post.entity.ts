import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Column('text', { array: true, nullable: true })
  @IsOptional()
  comment: string[];

  @Column()
  @IsOptional()
  likes: number;

  @Column()
  @IsOptional()
  share: string;

  @Column()
  created_at: Date = new Date();

  @Column('text', { array: true, nullable: true })
  media: string[];
}
