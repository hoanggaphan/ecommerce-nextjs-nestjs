import axios from 'axios';
import useSWR from 'swr';
import { CategoryType } from '../../types';
import { server } from '../constants';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useCategory() {
  const { data, error, mutate } = useSWR<CategoryType[]>(
    `${server}/category`,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useCategory>;
