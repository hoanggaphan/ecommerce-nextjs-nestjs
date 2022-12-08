import axios from 'axios';
import useSWR from 'swr';
import { AttributeType } from '../../types/index';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useAdminAttribute(token?: string) {
  const { data, error, mutate } = useSWR<AttributeType[]>(
    token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/admin/attribute`, token]
      : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAdminAttribute>;
