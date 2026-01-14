import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Response } from "express";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
  region: process.env.OBJECT_STORAGE_REGION || "auto",
  credentials: {
    accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY || "",
    secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY || "",
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.OBJECT_STORAGE_BUCKET || "";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export const objectStorageClient = {};

export class ObjectStorageService {
  constructor() {}

  async getObjectEntityUploadURL(): Promise<string> {
    const objectId = randomUUID();
    const key = `uploads/${objectId}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { 
      expiresIn: 3600,
    });
  }

  async getObjectEntityFile(objectPath: string): Promise<{ bucket: string; key: string }> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const key = objectPath.slice("/objects/".length);
    
    try {
      await s3Client.send(new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }));
      return { bucket: BUCKET_NAME, key };
    } catch (error) {
      throw new ObjectNotFoundError();
    }
  }

  async downloadObject(file: { bucket: string; key: string }, res: Response, cacheTtlSec: number = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: file.bucket,
        Key: file.key,
      });

      const response = await s3Client.send(command);
      
      res.set({
        "Content-Type": response.ContentType || "application/octet-stream",
        "Content-Length": response.ContentLength,
        "Cache-Control": `public, max-age=${cacheTtlSec}`,
      });

      if (response.Body) {
        (response.Body as any).pipe(res);
      } else {
        res.status(500).json({ error: "Empty response body" });
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }

    try {
      const url = new URL(rawPath);
      const path = url.pathname;
      const bucketPrefix = `/${BUCKET_NAME}/`;
      
      if (path.startsWith(bucketPrefix)) {
        return `/objects/${path.slice(bucketPrefix.length)}`;
      }
      
      return `/objects/${path.startsWith('/') ? path.slice(1) : path}`;
    } catch (e) {
      return rawPath;
    }
  }

  async trySetObjectEntityAclPolicy(rawPath: string, aclPolicy: any): Promise<string> {
    return this.normalizeObjectEntityPath(rawPath);
  }

  async canAccessObjectEntity({ userId, objectFile }: { userId?: string; objectFile: any }): Promise<boolean> {
    return true;
  }
}
