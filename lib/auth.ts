/**
 * Ki Pahare DigiGuide - NextAuth Configuration
 * Authentication setup for admin users
 */

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username: string;
      email: string;
    };
  }

  interface User {
    id: number;
    username: string;
    email: string;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Query admin user from database
          const result = await sql`
            SELECT id, username, email, password_hash 
            FROM admin_users 
            WHERE username = ${credentials.username as string}
            LIMIT 1
          `;

          if (result.rows.length === 0) {
            return null;
          }

          const user = result.rows[0];

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object (password_hash excluded)
          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as number;
        (session.user as any).username = token.username as string;
        (session.user as any).email = token.email as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      
      if (isOnAdmin && !isLoggedIn) {
        return false; // Redirect to login
      }
      
      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
