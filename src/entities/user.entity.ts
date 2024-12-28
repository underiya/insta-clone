import {
  IsNotEmpty,
  IsEmail,
  IsStrongPassword,
  IsString,
  IsEnum,
} from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.entity';

enum Role {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @Column()
  @IsString()
  profile_pic: string;

  @Column()
  @IsEnum(Role)
  account_type: Role;

  @Column()
  created_At: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
