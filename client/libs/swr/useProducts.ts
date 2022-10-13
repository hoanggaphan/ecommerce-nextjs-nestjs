import useSWR from 'swr';
import { ProductType } from '../../types/index';
import api from '../api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useProducts() {
  const { data, error, mutate } = useSWR<ProductType[]>(
    `http://localhost:4000/product`,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useProducts>;
