import axios from 'axios';
import useSWR from 'swr';
import { UserPaginateType } from '../../types/index';

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

export function useAdminUsers(queryParams?: string, token?: string) {
  const { data, error, mutate } = useSWR<UserPaginateType>(
    token
      ? [`${process.env.NEXT_PUBLIC_API_URL}/admin/user`, token, queryParams]
      : null,
    fetchWithToken
  );

  return {
    data,
    error,
    mutate,
  };
}
export type usersState = ReturnType<typeof useAdminUsers>;
