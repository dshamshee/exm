import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export type UploadPreset = "profile" | "signature";

interface UploadOptions {
  preset: UploadPreset;
  candidateId: string;
}

interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Preset configurations for different image types.
 * Cloudinary handles compression/format conversion server-side.
 */
const PRESETS: Record<
  UploadPreset,
  { publicIdName: string; transformation: object[] }
> = {
  profile: {
    publicIdName: "profile",
    transformation: [
      {
        width: 400,
        height: 400,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
  },
  signature: {
    publicIdName: "signature",
    transformation: [
      {
        width: 300,
        height: 150,
        crop: "fit",
        quality: "auto:low",
        fetch_format: "auto",
      },
    ],
  },
};

/**
 * Upload a file buffer to Cloudinary with automatic compression.
 *
 * Folder structure: exam/candidates/{candidateId}/profile | signature
 * Re-uploads overwrite the previous image (no orphaned files).
 */
export function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions
): Promise<UploadResult> {
  const { preset, candidateId } = options;
  const config = PRESETS[preset];
  const folder = `exam/candidates/${candidateId}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: config.publicIdName,
        overwrite: true,
        resource_type: "image",
        transformation: config.transformation,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary returned no result"));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
