import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    mongodb_uri: process.env.MONGODB_URI,
    port: process.env.PORT,
    jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    node_mailer_sender_address: process.env.NODE_MAILER_SENDER_ADDRESS,
    node_mailer_sender_app_password: process.env.NODE_MAILER_SENDER_APP_PASSWORD
}