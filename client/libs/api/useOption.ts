import useSWR from 'swr';
import api from '../api';
import { OptionType } from './../../types/index';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useOption() {
  const { data, error, mutate } = useSWR<OptionType[]>(
    'http://localhost:4000/option',
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useOption>;
