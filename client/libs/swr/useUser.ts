import axios from 'axios';
import useSWR from 'swr';
import { UserType } from './../../types/index';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useUser(id: string | string[] | undefined, token?: string) {
  const { data, error, isValidating, mutate } = useSWR<UserType>(
    id && token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`, token]
      : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isValidating,
  };
}
export type userState = ReturnType<typeof useUser>;
