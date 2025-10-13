// Load environment variables for testing
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.test or .env.development
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.development';
config({ path: resolve(__dirname, '..', envFile) });

// Ensure MONGO_URI is set
if (!process.env.MONGO_URI) {
  process.env.MONGO_URI = 'mongodb://localhost:27017/marcel-test';
}
