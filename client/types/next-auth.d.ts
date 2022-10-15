import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: {
    //   /** The user's postal address. */
    //   address: string;
    // } & DefaultSession['user'];
    accessTokenExpiry: number;
    accessToken: string;
    refreshToken: string;
    error: string;
    roles: ['admin', 'user'];
  }
}
