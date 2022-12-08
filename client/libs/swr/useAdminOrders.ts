import axios from 'axios';
import useSWR from 'swr';
import { OrderPaginateType } from '../../types/index';

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

export function useAdminOrders(queryParams?: string, token?: string) {
  const { data, error, mutate } = useSWR<OrderPaginateType>(
    token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/admin/order`, token, queryParams]
      : null,
    fetchWithToken
  );

  return {
    data,
    error,
    mutate,
  };
}
export type ordersState = ReturnType<typeof useAdminOrders>;
