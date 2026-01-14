import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Response } from "express";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // Often needed for custom S3 providers
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

// Re-adding objectStorageClient as an empty object since it's expected by other files
export const objectStorageClient = {};

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export class ObjectStorageService {
  constructor() {}

  async getObjectEntityUploadURL(): Promise<string> {
    const objectId = randomUUID();
    const key = `uploads/${objectId}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 900 });
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
    // If it's already a local path, return it
    if (rawPath.startsWith("/objects/")) {
      return rawPath;
    }

    try {
      const url = new URL(rawPath);
      // Try to extract the key from the URL
      // This is a simplified version, might need adjustment based on specific S3 provider URL structure
      const path = url.pathname.startsWith(`/${BUCKET_NAME}/`) 
        ? url.pathname.slice(BUCKET_NAME.length + 2)
        : url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
        
      return `/objects/${path}`;
    } catch (e) {
      return rawPath;
    }
  }

  async trySetObjectEntityAclPolicy(rawPath: string, aclPolicy: any): Promise<string> {
    return this.normalizeObjectEntityPath(rawPath);
  }

  async canAccessObjectEntity({ userId, objectFile }: { userId?: string; objectFile: any }): Promise<boolean> {
    return true; // Simple implementation for now
  }
}
