import { envConfig } from "@/config/index";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import path from "path";
import sharp from "sharp";
import { FileUploadResponse } from "./s3.interface";
import ApiError from "@/middlewares/error";
import { HttpStatusCode } from "@/lib/httpStatus";

class Service {
  private readonly bucketName = envConfig.aws.bucket_name;
  private readonly region = envConfig.aws.region;
  private readonly accessKeyId = envConfig.aws.access_key_id;
  private readonly secretAccessKey = envConfig.aws.secret_access_key;
  private readonly uploadBaseUrl = envConfig.aws.file_load_base_url;
  private readonly rootFolder = "appify-social";

  private s3Client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
  });

  private getPublicUrl(key: string) {
    return `${this.uploadBaseUrl}/${key}`;
  }

  private async uploadFileToS3(
    file: Express.Multer.File,
    folder: string
  ): Promise<FileUploadResponse> {
    try {
      const metadata = await sharp(file.buffer).metadata();
      const fileExt = path.extname(file.originalname).toLowerCase();
      const fileName = `${randomUUID()}${fileExt}`;
      const key = `${this.rootFolder}/${folder}/${fileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);
      return {
        public_id: key,
        url: this.getPublicUrl(key),
        original_name: file.originalname,
        mime_type: file.mimetype,
        extension: fileExt,
        file_size: file.size,
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
      };
    } catch (error: any) {
      console.log(error);
      throw new ApiError(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        error?.message || "Failed to upload file on S3"
      );
    }
  }

  private async deleteFileFromS3(key: string): Promise<void> {
    console.log(`[AWS S3] Deleting file with key: ${key}`);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      console.log(`[AWS S3] Successfully Deleted file with key: ${key}`);
    } catch (error: any) {
      console.error(`[AWS S3] Error deleting file: ${key}`, error?.message);
    }
  }

  private async deleteMultipleFilesFromS3(keys: string[]): Promise<void> {
    console.log(`[AWS S3] Deleting files with keys: ${keys.join(", ")}`);
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
          Quiet: false,
        },
      });
      await this.s3Client.send(command);
      console.log(
        `[AWS S3] Successfully Deleted files with keys: ${keys.join(", ")}`
      );
    } catch (error: any) {
      console.error(
        `[AWS S3] Error deleting files: ${keys.join(", ")}`,
        error?.message
      );
    }
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folder: string
  ): Promise<FileUploadResponse> {
    return await this.uploadFileToS3(file, folder);
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string
  ): Promise<FileUploadResponse[]> {
    const uploadPromises = files.map((file) =>
      this.uploadFileToS3(file, folder)
    );
    return await Promise.all(uploadPromises);
  }

  async deleteSingleFile(public_id: string) {
    await this.deleteFileFromS3(public_id);
  }

  async deleteMultipleFiles(public_ids: string[]) {
    await this.deleteMultipleFilesFromS3(public_ids);
  }
}

export const S3Service = new Service();
