import axios from 'axios';
import useSWR from 'swr';
import { CategoryType } from '../../types';
import { server } from '../constants';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useAdminCategory(token?: string) {
  const { data, error, mutate } = useSWR<CategoryType[]>(
    token ? [`${server}/admin/category`, token] : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAdminCategory>;
