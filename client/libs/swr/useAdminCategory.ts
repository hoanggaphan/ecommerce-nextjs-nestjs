import axios from 'axios';
import useSWR from 'swr';
import { CategoryType } from '../../types';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useAdminCategory(token?: string) {
  const { data, error, mutate } = useSWR<CategoryType[]>(
    token ? [`${process.env.NEXT_PUBLIC_API_URL}/admin/category`, token] : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAdminCategory>;
