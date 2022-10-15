import useSWR from 'swr';
import api from '../api';
import { ProductPaginateType } from './../../types/index';

const fetchWithToken = (
  url: string,
  token: string,
  queryParams: string = ''
) => {
  return api
    .get(`${url}${queryParams}`, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);
};

export function useAdminProducts(queryParams?: string, token?: string) {
  const { data, error, mutate } = useSWR<ProductPaginateType>(
    token ? ['http://localhost:4000/product/admin', token, queryParams] : null,
    fetchWithToken
  );

  return {
    data,
    error,
    mutate,
  };
}
export type categoryState = ReturnType<typeof useAdminProducts>;
