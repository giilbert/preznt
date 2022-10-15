import { env } from "@/env/server.mjs";
import { Storage } from "@google-cloud/storage";

export const rawStorage = new Storage({
  credentials: JSON.parse(env.GOOGLE_CLOUD_SERVICE_CREDENTIALS),
});
const bucket = rawStorage.bucket(env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME);
const BASE_URL = `https://storage.googleapis.com/${env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME}`;

// creates upload / replaces file at [key] with base64 data
const uploadPublic = async (key: string, data: string) => {
  await bucket
    .file(key)
    .save(Buffer.from(data, "base64"), { private: false, public: true });
};

const clone = async (from: string, to: string) => {
  await bucket.file(from).copy(to);
};

const key = (key: string) => `${BASE_URL}/${key}`;

export const storage = {
  uploadPublic,
  clone,
  key,
};
