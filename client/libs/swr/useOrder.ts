import axios from 'axios';
import useSWR from 'swr';
import { OrderType } from '../../types/index';
import { server } from '../constants';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useOrder({
  id,
  token,
}: {
  id: string | string[] | undefined;
  token?: string;
}) {
  const { data, error, isValidating, mutate } = useSWR<OrderType>(
    token && id ? [`${server}/order/${id}`, token] : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
    isValidating,
  };
}
export type orderState = ReturnType<typeof useOrder>;
