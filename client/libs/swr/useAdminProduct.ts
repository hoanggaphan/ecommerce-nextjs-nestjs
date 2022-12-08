import axios from 'axios';
import useSWR from 'swr';
import { ProductType } from '../../types/index';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useAdminProduct(
  id: string | string[] | undefined,
  token?: string
) {
  const { data, error, isValidating, mutate } = useSWR<ProductType>(
    id && token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/admin/product/${id}`, token]
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
export type categoryState = ReturnType<typeof useAdminProduct>;
