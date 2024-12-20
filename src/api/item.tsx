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

type ItemStateLiteral = "valid" | "sold" | "hidden";

export interface ItemIn {
  item_id: number;
  user_id: number;
  name: string;
  description: string;
  price: number;
  created_time: number;
  state: ItemStateLiteral;
  tags: TagIn[];
  tag_name_list: string[];
}

export interface ItemDetailedIn extends ItemIn {
  seller: UserIn;
  fav_count: number;
}

export interface ItemOut {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface ItemOutWithId extends ItemOut {
  item_id: number;
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
export function useItemDetailedInfo(item_id: string | null) {
  return useSWR(
    ["/item/detailed", item_id],
    () => getItemDetailedInfo(item_id as string), // Fetcher function
    {
      keepPreviousData: true,
    },
  );
}

/**
 * Add a new item to the inventory.
 *
 * @param itemData - Object containing item details including name, description, price, and tags.
 * @returns The created item's data or throws an error if the operation fails.
 */
export async function addItem(itemData: ItemOut) {
  try {
    const res = await axiosIns.post("/item/add", itemData);
    return res.data as ItemIn;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Update an item's details.
 *
 * @param updatedData - Object containing the updated details including item_id, name, description, price, and tags.
 * @returns The updated item's data or throws an error if the operation fails.
 */
export async function editItem(updatedData: ItemOutWithId) {
  try {
    const res = await axiosIns.post("/item/update", updatedData);
    return res.data as ItemIn;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Remove a list of items by their IDs.
 *
 * @param itemIdList - An array of item ID numbers to remove.
 * @returns The server's response data indicating success or throws an error if the operation fails.
 */
export async function removeItems(itemIdList: number[]) {
  try {
    const res = await axiosIns.delete("/item/remove", { data: itemIdList });
    return res.data as {
      success: boolean;
      operation: string;
      total: number;
    }[];
  } catch (e) {
    apiErrorThrower(e);
  }
}

// API function to fetch recently published items
export async function getRecentlyPublished() {
  try {
    const res = await axiosIns.get("/item/recent");
    return res.data as ItemIn[]; // Response is a list of ItemIn objects
  } catch (e) {
    apiErrorThrower(e);
  }
}

// SWR hook to fetch and cache recently published items
export function useRecentlyPublished() {
  return useSWR("/item/recent", getRecentlyPublished, {
    keepPreviousData: true,
  });
}

/**
 * SWR hook for recently active tags in recently published items.
 */
export function useRecentlyActiveTags() {
  const { data: recentItems, error } = useRecentlyPublished();

  const tags = recentItems
    ? recentItems.flatMap((item) => item.tags.map((tag) => tag))
    : [];

  // Remove duplicates from tags
  const uniqueTags = Array.from(new Set(tags));

  return {
    tags: uniqueTags,
    isLoading: !recentItems && !error,
    error,
  };
}
