import axios from 'axios';
import useSWR from 'swr';
import { server } from '../constants';
import { ProductPaginateType } from './../../types/index';

const fetcher = (url: string, queryParams: string = '') => {
  return axios.get(`${url}${queryParams}`).then((res) => res.data);
};

export function useProducts(queryParams?: string) {
  const { data, error, mutate } = useSWR<ProductPaginateType>(
    [`${server}/product`, queryParams],
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useProducts>;
