import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function useAuthUser(shouldRedirect: boolean) {
  const { data: session } = useSession();

  useEffect(() => {
    // Check Refresh Token Expired
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/auth/login', redirect: shouldRedirect });
    }
  }, [session]);

  return null;
}
