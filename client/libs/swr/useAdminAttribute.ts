import axios from 'axios';
import useSWR from 'swr';
import { AttributeType } from '../../types/index';
import { server } from '../constants';

const fetcher = (url: string, token: string) =>
  axios
    .get(url, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);

export function useAdminAttribute(token?: string) {
  const { data, error, mutate } = useSWR<AttributeType[]>(
    token ? [`${server}/admin/attribute`, token] : null,
    fetcher
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAdminAttribute>;
