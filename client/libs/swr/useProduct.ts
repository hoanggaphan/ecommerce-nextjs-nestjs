import axios from 'axios';
import useSWR from 'swr';
import { ProductType } from '../../types/index';
import { server } from '../constants';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useProduct({ slug }: { slug: string | string[] | undefined }) {
  const { data, error, isValidating, mutate } = useSWR<ProductType>(
    slug ? `${server}/product/${slug}` : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isValidating,
  };
}
export type categoryState = ReturnType<typeof useProduct>;
