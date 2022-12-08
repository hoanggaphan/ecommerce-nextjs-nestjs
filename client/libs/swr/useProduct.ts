import axios from 'axios';
import useSWR from 'swr';
import { ProductType } from '../../types/index';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useProduct({ slug }: { slug: string | string[] | undefined }) {
  const { data, error, isValidating, mutate } = useSWR<ProductType>(
    slug ? `${process.env.NEXT_PUBLIC_API_URL}/product/${slug}` : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isValidating,
  };
}
export type productState = ReturnType<typeof useProduct>;
