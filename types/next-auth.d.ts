/**
 * NextAuth Type Extensions
 * Extends default NextAuth types with custom user properties
 */

import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string | number;
      name: string;
      email: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
  }
}
