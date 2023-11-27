import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function useRoles(roles: string[], redirectTo: string = '/') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const hasRequiredRoles = session?.roles.some((role) =>
      roles.includes(role)
    );

    if (status === 'authenticated' && !hasRequiredRoles) {
      router.replace(redirectTo);
    }
  }, [session]);

  return { session, status };
}
