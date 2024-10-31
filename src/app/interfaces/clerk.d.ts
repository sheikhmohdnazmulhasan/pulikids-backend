import { ClerkRequest } from '@clerk/express';

declare global {
    namespace Express {
        interface Request extends ClerkRequest { }
    }
}
