import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.API_COMPILE_SECRET_KEY as string;
if (!secretKey) {
  throw new Error('API_COMPILE_SECRET_KEY is not set in the environment variables');
}

// キーをUTF-8エンコーディングでバッファに変換
const key = Buffer.from(secretKey, 'utf8');

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (hash: string) => {
  const [ivHex, encrypted] = hash.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
