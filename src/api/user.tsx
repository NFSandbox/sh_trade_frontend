import useSWR, { mutate } from "swr";

import Session from "supertokens-web-js/recipe/session";

import { axiosIns } from "./axios";
import {
  apiErrorThrower,
  BaseError,
  ParamError,
  errorPopper,
  getBackendErrorFromResponse,
} from "@/exceptions/error";
import { useRouter } from "next/navigation";

// Tools
import { asyncSleep } from "@/tools/general";

/**
 * Get me info from API.
 *
 * Returns:
 *
 * If success, return `string` of current logged in account's role name. If not logged in, return `null`.
 */
export async function updateUserDescription(
  description: string
): Promise<unknown> {
  let data = null;

  try {
    const res = await axiosIns.post("/user/description", {
      description: description,
    });
    data = res.data;
    mutate("/user/me");
    return data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

export interface ContactInfoIn {
  contact_type: string;
  contact_info: string;
  contact_info_id: number;
  verified: boolean;
}

export async function getContactInfo(
  user_id?: number
): Promise<ContactInfoIn[] | null> {
  let data = null;

  try {
    const res = await axiosIns.get("/user/contact_info", {
      params: { user_id },
    });

    data = res.data;
    return data;
  } catch (e) {
    apiErrorThrower(e);
    return null;
  }
}

export function useContactInfo(user_id?: number) {
  return useSWR(
    ["/user/contact_info", user_id],
    (keys) => getContactInfo(keys[1]),
    { keepPreviousData: true }
  );
}

/**
 * Schama used when creating new contact info
 */
export interface ContactInfoOutNew {
  contact_type: string;
  contact_info: string;
}

export async function addContactInfo(
  contactInfo: ContactInfoOutNew,
  userId?: number
) {
  let data = null;

  try {
    const res = await axiosIns.post("/user/contact_info/add", contactInfo);
    data = res.data;

    // if success, mutate contact info swr key to trigger revalidate
    mutate(["/user/contact_info", userId]);
    return data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Remove a contact info from current user
 */
export async function removeContactInfo(
  contactInfo: ContactInfoIn,
  userId?: number
) {
  let data = null;

  try {
    const res = await axiosIns.delete("/user/contact_info/remove", {
      data: contactInfo,
    });
    data = res.data;

    // if success, mutate contact info swr key to trigger revalidate
    mutate(["/user/contact_info", userId]);
    return data;
  } catch (e) {
    apiErrorThrower(e);
  }
}
