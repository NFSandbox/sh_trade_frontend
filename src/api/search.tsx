import useSWR from "swr";
import { axiosIns } from "./axios";
import { apiErrorThrower } from "@/exceptions/error";
import * as gene from "./general";
import { TagIn, ItemIn } from "./item";

export interface SearchParams {
  keyword: string;
  pagination?: gene.PaginationConfig | null;
}

/**
 * Search for items by name.
 *
 * @param params - The search parameters, including a keyword and optional pagination.
 * @returns A paginated list of items matching the keyword.
 */
export async function searchItemsByName(params: SearchParams) {
  try {
    const res = await axiosIns.post("/search/item/by_name", params.pagination, {
      params: { keyword: params.keyword },
    });
    return res.data as gene.PaginatedResult<ItemIn>;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Search for items by tags.
 *
 * @param params - The search parameters, including a keyword and optional pagination.
 * @returns A paginated list of items matching the tags keyword.
 */
export async function searchItemsByTags(params: SearchParams) {
  try {
    const res = await axiosIns.post("/search/item/by_tags", params.pagination, {
      params: { keyword: params.keyword },
    });
    return res.data as gene.PaginatedResult<ItemIn>;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * SWR hook for searching items by name.
 *
 * @param params - The search parameters, including a keyword and optional pagination.
 * @returns The SWR response containing the search results.
 */
export function useSearchItemsByName(params: SearchParams) {
  return useSWR(
    ["/search/item/by_name", params],
    () => searchItemsByName(params),
    { keepPreviousData: true },
  );
}

/**
 * SWR hook for searching items by tags.
 *
 * @param params - The search parameters, including a keyword and optional pagination.
 * @returns The SWR response containing the search results.
 */
export function useSearchItemsByTags(params: SearchParams) {
  return useSWR(
    ["/search/item/by_tags", params],
    () => searchItemsByTags(params),
    { keepPreviousData: true },
  );
}
