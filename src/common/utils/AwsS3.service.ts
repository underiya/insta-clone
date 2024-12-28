import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { S3Config } from '../configuration/s3';
import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  constructor() {}

  async uploadFileToS3(file: any, destination: string): Promise<string> {
    const key = `${file.originalname}`;

    try {
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: destination + key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const upload = new Upload({
        client: S3Config,
        params: uploadParams,
      });

      await upload.done();

      return `http://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${destination}${key}`;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFileFromS3(file: string): Promise<string> {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file,
    };
    await S3Config.send(new DeleteObjectCommand(params));
    return 'file deleted';
  }

  async getFileFromS3(file: string): Promise<string> {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file,
      };
      const res = await S3Config.send(new GetObjectCommand(params));
      return res.Body.toString();
    } catch (error) {
      console.log(error);
    }
  }
}
