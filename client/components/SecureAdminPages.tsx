import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function SecureAdminPages({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/auth/login', redirect: true });
    }

    // null = failed to retrieve the session
    // undefined = status loading
    if (session === null) {
      router.replace('/auth/login');
    }
    if (
      session &&
      !session.roles.some(
        (e: string) => e === 'admin' || e === 'manager' || e === 'employee'
      )
    ) {
      router.replace('/');
    }
  }, [session]);

  return (
    <>
      {session &&
        session.roles.some(
          (e: string) => e === 'admin' || e === 'manager' || e === 'employee'
        ) &&
        children}
    </>
  );
}
