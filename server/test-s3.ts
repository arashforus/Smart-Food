import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

async function testConnection() {
  console.log("Testing connection to S3...");
  console.log("Endpoint:", process.env.S3_ENDPOINT);
  console.log("Bucket:", process.env.S3_BUCKET_NAME);
  
  try {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log("Successfully connected to S3!");
    console.log("Available buckets:", response.Buckets?.map(b => b.Name).join(", "));
    
    const bucketExists = response.Buckets?.some(b => b.Name === process.env.S3_BUCKET_NAME);
    if (bucketExists) {
      console.log(`Target bucket "${process.env.S3_BUCKET_NAME}" exists.`);
    } else {
      console.log(`Target bucket "${process.env.S3_BUCKET_NAME}" NOT found.`);
    }
  } catch (error) {
    console.error("Failed to connect to S3:", error);
  }
}

testConnection();
