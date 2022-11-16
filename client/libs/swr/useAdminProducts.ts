import axios from 'axios';
import useSWR from 'swr';
import { server } from '../constants';
import { ProductPaginateType } from './../../types/index';

const fetchWithToken = (
  url: string,
  token: string,
  queryParams: string = ''
) => {
  return axios
    .get(`${url}${queryParams}`, {
      headers: { Authorization: 'Bearer ' + token },
    })
    .then((res) => res.data);
};

export function useAdminProducts(queryParams?: string, token?: string) {
  const { data, error, mutate } = useSWR<ProductPaginateType>(
    token ? [`${server}/admin/product`, token, queryParams] : null,
    fetchWithToken
  );

  return {
    data,
    error,
    mutate,
  };
}
export type productsState = ReturnType<typeof useAdminProducts>;
