import axios from 'axios';
import useSWR from 'swr';
import { CategoryType } from '../../types';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useCategory() {
  const { data, error, mutate } = useSWR<CategoryType[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/category`,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useCategory>;
