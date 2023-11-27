import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useAuth(shouldRedirect: boolean) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/auth/login', redirect: shouldRedirect });
      return;
    }

    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [session]);

  return {};
}
