import useSWR from 'swr';
import api from '../api';
import { ProductType } from '../../types/index';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useProduct({ id }: { id: string | string[] | undefined }) {
  const { data, error, mutate } = useSWR<ProductType>(
    id ? `http://localhost:4000/product/${id}` : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useProduct>;
