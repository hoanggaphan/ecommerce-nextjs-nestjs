import axios from 'axios';
import useSWR from 'swr';
import { AttributeType } from '../../types/index';
import { server } from '../constants';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useAttribute() {
  const { data, error, mutate } = useSWR<AttributeType[]>(
    `${server}/attribute`,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAttribute>;
