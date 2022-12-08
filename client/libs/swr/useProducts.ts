import axios from 'axios';
import useSWR from 'swr';
import { ProductPaginateType } from '../../types/index';

const fetcher = (url: string, queryParams: string = '') => {
  return axios.get(`${url}${queryParams}`).then((res) => res.data);
};

export function useProducts(queryParams?: string, isFetch: boolean = true) {
  const { data, error, mutate, isValidating } = useSWR<ProductPaginateType>(
    isFetch
      ? [`${process.env.NEXT_PUBLIC_API_URL}/product`, queryParams]
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
export type productsState = ReturnType<typeof useProducts>;
