import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import { comparePasswords } from '@/lib/utils';
import { ObjectId } from 'mongodb';

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      isActive: boolean;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
    name?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: string;
    isActive: boolean;
  }
}

interface DatabaseUser {
  _id: ObjectId;
  email: string;
  password: string;
  role: string;
  isActive?: boolean;
  loginAttempts?: number;
  lastLogin?: Date;
  updatedAt?: Date;
}

// Export authOptions so it can be imported in other files
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
        userType: { label: "User Type", type: "text", placeholder: "admin or superadmin" }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          const { db } = await connectToDatabase();
          const email = credentials.email.toLowerCase().trim();
          const userType = credentials.userType || 'admin'; // Default to admin if not specified
          
          let user: DatabaseUser | null = null;

          if (userType === 'superadmin') {
            // ONLY check in superadmin collection for superadmin login
            user = await db.collection('superadmin').findOne<DatabaseUser>({
              email: email,
              role: 'superadmin'
            });
            
            if (!user) {
              throw new Error('Invalid super admin credentials');
            }
          } else {
            // ONLY check in admin collection for admin login
            user = await db.collection('admin').findOne<DatabaseUser>({
              email: email,
              role: 'admin'
            });
            
            if (!user) {
              throw new Error('Invalid admin credentials');
            }
          }

          // Check if account is active
          if (user.isActive === false) {
            throw new Error(`Account is ${user.role === 'superadmin' ? 'deactivated' : 'disabled'}`);
          }

          // Verify password
          const isPasswordValid = await comparePasswords(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            // Increment login attempts if field exists
            if (user.loginAttempts !== undefined) {
              const collection = user.role === 'superadmin' ? 'superadmin' : 'admin';
              await db.collection(collection).updateOne(
                { _id: user._id },
                { 
                  $inc: { loginAttempts: 1 },
                  $set: { updatedAt: new Date() }
                }
              );
            }
            throw new Error('Invalid credentials');
          }

          // Reset login attempts and update last login on successful login
          const collection = user.role === 'superadmin' ? 'superadmin' : 'admin';
          await db.collection(collection).updateOne(
            { _id: user._id },
            { 
              $set: { 
                loginAttempts: 0,
                lastLogin: new Date(),
                updatedAt: new Date()
              }
            }
          );

          // Return user object without password
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.email.split('@')[0],
            isActive: user.isActive ?? true
          };
        } catch (error: any) {
          console.error('Authorization error:', error.message);
          throw new Error(error.message || 'Authentication failed');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.isActive = user.isActive;
      }

      // Update token with session data (if needed)
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          isActive: token.isActive as boolean,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };