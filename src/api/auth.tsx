import useSWR, { mutate } from "swr";

import Session from "supertokens-web-js/recipe/session";

import { axiosIns } from './axios';
import { apiErrorThrower, BaseError, ParamError, errorPopper, getBackendErrorFromResponse } from '@/exceptions/error';
import { useRouter } from "next/navigation";

interface LoginCredentials {
  name: string;
  password: string;
}


export async function signOut() {
  await Session.signOut();
  await mutate('/user/me');
  return;
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
 * If success, return `string` of current logged in account's role name. If not logged in, return `null`.
 */
export async function getMe(): Promise<UserIn | null> {
  let data = null;

  try {
    let res = await axiosIns.get('/user/me');
    data = res.data;
    return (data as UserIn);
  } catch (e) {
    const backendError = getBackendErrorFromResponse((e as any).response);
    if (backendError !== undefined && backendError.name === 'token_required') {
      return null;
    }
    apiErrorThrower(e);
    return null;
  }
}


export function useGetMe() {
  return useSWR('/user/me', getMe, { keepPreviousData: true });
}


/**
 * Similar to getMe(), but force redirect to auth page if no valid user.
 */
export function useGetMeForce() {
  const router = useRouter();
  const { data } = useGetMe();

  if (data === null) {
    router.push('/auth');
  }

  return useGetMe();
}