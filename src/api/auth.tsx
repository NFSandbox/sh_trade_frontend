import useSWR, { mutate } from "swr";

import { axiosIns } from './axios';
import { apiErrorThrower, responseErrorThrower, BaseError, ParamError, errorPopper } from '@/exceptions/error';

interface LoginCredentials {
  name: string;
  password: string;
}


/**
 * Call API to log out an account.
 */
export async function logout() {
  let data = undefined;

  try {
    // get login info from server
    let res = await axiosIns.get('/auth/logout');
    data = res.data;

    // if successfully logged out, revalidate me info API.
    await mutate('/user/me');
  } catch (e) {
    // even if error caught, still need to revalidate me info API.
    await mutate('/user/me');
    apiErrorThrower(e);
  }

  return data;
}


export interface UserIn {
  user_id: number;
  campus_id: number | null; // assuming campus_id can be a number or null
  username: string;
  description: string | null; // assuming description can be a string or null
  created_time: number; // assuming created_time is a timestamp in milliseconds
}


/**
 * Get me info from API.
 *
 * Returns:
 *
 * If success, return `string` of current logged in account's role name. If not logged in, return `undefined`.
 */
export async function getMe(): Promise<UserIn | undefined> {
  let data = undefined;

  try {
    let res = await axiosIns.get('/user/me');
    data = res.data;
    return (data as UserIn);
  } catch (e) {
    apiErrorThrower(e);
  }
}


export function useGetMe() {
  return useSWR('/user/me', getMe);
}