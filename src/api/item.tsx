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

export interface ItemIn {
  item_id: number;
  user_id: number;
  title: string;
  description: string;
  price: number;
  created_time: number;
  sold: boolean;
  hidden: boolean;
  // Define other properties based on the item structure returned by the API
}

/**
 * Get items of a user by user ID.
 *
 * @param user_id - ID of the user to fetch items for. Defaults to current user if ignored.
 * @param ignore_sold - Whether to ignore items that have been sold. Defaults to false.
 * @param time_desc - Whether to sort by created time in descending order. Defaults to true.
 * @returns A list of items or throws an error if there's an issue.
 */
export async function getUserItems(
  user_id?: number,
  ignore_sold: boolean = false,
  time_desc: boolean = true
): Promise<ItemIn[]> {
  try {
    const res = await axiosIns.get("/item", {
      params: {
        user_id,
        ignore_sold,
        time_desc,
      },
    });
    return res.data as ItemIn[];
  } catch (e) {
    apiErrorThrower(e);
  }
}

export function useUserItems(
  user_id?: number,
  ignore_sold: boolean = false,
  time_desc: boolean = true
) {
  return useSWR(
    ["/item", user_id, ignore_sold, time_desc],
    () => getUserItems(user_id, ignore_sold, time_desc),
    { keepPreviousData: true }
  );
}
