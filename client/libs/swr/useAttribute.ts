import useSWR from 'swr';
import { AttributeType } from '../../types/index';
import api from '../api';

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export function useAttribute() {
  const { data, error, mutate } = useSWR<AttributeType[]>(
    'http://localhost:4000/attribute',
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAttribute>;
