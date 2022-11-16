import axios from 'axios';
import useSWR from 'swr';
import { server } from '../constants';
import { OrderType } from './../../types/index';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useOrder({ id }: { id: string | string[] | undefined }) {
  const { data, error, isValidating, mutate } = useSWR<OrderType>(
    id ? `${server}/order/${id}` : null,
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
