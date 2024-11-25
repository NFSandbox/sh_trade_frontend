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

// Other API Components
import * as gene from "./general";
import { UserIn } from "./auth";

export interface TagIn {
  tag_id: number;
  tag_type: string;
  name: string;
}

export interface ItemIn {
  item_id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  created_time: number;
  sold: boolean;
  hidden: boolean;
  tags: TagIn[];
  tag_name_list: string[];
}

export interface ItemDetailedIn extends ItemIn {
  seller: UserIn;
  fav_count: number;
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
  time_desc: boolean = true,
  pagination?: gene.PaginationConfig,
) {
  try {
    const res = await axiosIns.post(
      "/item",
      {
        pagination,
      },
      {
        params: {
          user_id,
          ignore_sold,
          time_desc,
        },
      },
    );
    return res.data as gene.PaginatedResult<ItemIn>;
  } catch (e) {
    apiErrorThrower(e);
  }
}

export function useUserItems(
  user_id?: number,
  ignore_sold: boolean = false,
  time_desc: boolean = true,
) {
  return useSWR(
    ["/item", user_id, ignore_sold, time_desc],
    () => getUserItems(user_id, ignore_sold, time_desc),
    { keepPreviousData: true },
  );
}

export async function getItemDetailedInfo(item_id: string) {
  try {
    const res = await axiosIns.get("/item/detailed", {
      params: {
        item_id,
      },
    });
    return res.data as ItemDetailedIn;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * SWR hook for getItemDetailedInfo
 */
export function useItemDetailedInfo(item_id: string) {
  return useSWR(
    ["/item/detailed", item_id],
    () => getItemDetailedInfo(item_id as string), // Fetcher function
    {
      keepPreviousData: true,
    },
  );
}
