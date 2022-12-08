import axios from 'axios';
import jwt_decode from 'jwt-decode';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

async function refreshAccessToken(tokenObject: any) {
  try {
    // Get a new set of tokens with a refreshToken
    const tokenResponse = await axios.post(
      process.env.NEXT_PUBLIC_API_URL + '/auth/refreshToken',
      {},
      {
        headers: {
          Authorization: `Bearer ${tokenObject.refreshToken}`,
        },
      }
    );

    // console.log({ server: tokenResponse.data });

    return {
      ...tokenObject,
      accessToken: tokenResponse.data.accessToken,
      accessTokenExpiry: (jwt_decode(tokenResponse.data.accessToken) as any)
        .exp,
    };
  } catch (error) {
    return {
      ...tokenObject,
      error: 'RefreshAccessTokenError',
    };
  }
}

const providers = [
  CredentialsProvider({
    name: 'Credentials',
    authorize: async (credentials) => {
      try {
        // Authenticate user with credentials
        const user = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + '/auth/login',
          {
            username: credentials?.username,
            password: credentials?.password,
          }
        );

        if (user.data.accessToken) {
          return user.data;
        }

        return null;
      } catch (e: any) {
        // throw new Error(e);
        return null;
      }
    },
    credentials: {
      username: { label: 'Username', type: 'text' },
      password: { label: 'Password', type: 'password' },
    },
  }),
];

const callbacks = {
  jwt: async ({ token, user }: any) => {
    if (user) {
      // This will only be executed at login. Each next invocation will skip this part.
      token.accessToken = user.accessToken;
      token.accessTokenExpiry = (jwt_decode(user.accessToken) as any).exp;
      token.refreshToken = user.refreshToken;
      token.roles = user.roles;
      token.fullName = user.fullName;
      token.phone = user.phone;
      token.address = user.address;
      token.username = user.username;
      token.userId = user.id;
    }

    // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
    // before 1 hours
    const shouldRefreshTime = Math.round(
      // token.accessTokenExpiry - Date.now() / 1000 // seconds
      token.accessTokenExpiry - 60 * 60 - Date.now() / 1000 // seconds
    );

    // If the token is still valid, just return it.
    if (shouldRefreshTime > 0) {
      return Promise.resolve(token);
    }

    // If the call arrives after 23 hours have passed, we allow to refresh the token.
    token = refreshAccessToken(token);
    return Promise.resolve(token);
  },
  session: async ({ session, token }: any) => {
    // Here we pass accessToken to the client to be used in authentication with your API
    session.userId = token.userId;
    session.fullName = token.fullName;
    session.phone = token.phone;
    session.address = token.address;
    session.username = token.username;
    session.accessToken = token.accessToken;
    session.accessTokenExpiry = token.accessTokenExpiry;
    session.refreshToken = token.refreshToken;
    session.error = token.error;
    session.roles = token.roles; // Add role value to user object so it is passed along with session

    return Promise.resolve(session);
  },
};

export const options = {
  providers,
  callbacks,
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.AUTH_SECRET,
  session: {
    maxAge: 31 * 24 * 60 * 60, // Cookie save token expires after 31 day
  },
};

const Auth = (req: any, res: any) => NextAuth(req, res, options);
export default Auth;
