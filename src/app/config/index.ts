import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT
}