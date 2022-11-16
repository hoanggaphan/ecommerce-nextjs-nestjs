import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: {} & DefaultSession['user'];
    username: string;
    userId: string;
    fullName?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    accessTokenExpiry: number;
    accessToken: string;
    refreshToken: string;
    error: string;
    roles: ['admin', 'user'];
  }
}
