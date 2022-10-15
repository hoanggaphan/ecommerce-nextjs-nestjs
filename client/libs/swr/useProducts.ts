import useSWR from 'swr';
import api from '../api';
import { ProductPaginateType } from './../../types/index';

const fetcher = (url: string, queryParams: string = '') => {
  return api.get(`${url}${queryParams}`).then((res) => res.data);
};

export function useProducts(queryParams?: string) {
  const { data, error, mutate } = useSWR<ProductPaginateType>(
    ['http://localhost:4000/product', queryParams],
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useProducts>;
