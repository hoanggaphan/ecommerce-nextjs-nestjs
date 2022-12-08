import axios from 'axios';
import useSWR from 'swr';
import { AttributeType } from '../../types/index';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useAttribute() {
  const { data, error, mutate } = useSWR<AttributeType[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/attribute`,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAttribute>;
