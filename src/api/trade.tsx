import useSWR from "swr";
import { axiosIns } from "./axios";
import { apiErrorThrower } from "@/exceptions/error";

/** Trade Record Output Interface */
export interface TradeRecordOut {
  trade_id: number;
  buyer_id: number;
  seller_id: number;
  item_id: number;
  state: string;
  created_time: number;
  updated_time: number;
}

/** Trades Filter Type Interface */
export interface TradesFilterTypeIn {
  filter?: string[];
}

/**
 * Start a new transaction as a buyer.
 *
 * @param item_id - The ID of the item to initiate a transaction for.
 * @returns The created Trade Record.
 */
export async function startTransaction(item_id: number) {
  try {
    const res = await axiosIns.post<TradeRecordOut>("/trade/start", {
      item_id,
    });
    return res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Accept a pending transaction as the seller.
 *
 * @param trade_id - The ID of the trade to accept.
 * @returns The updated Trade Record.
 */
export async function acceptTransaction(trade_id: number) {
  try {
    const res = await axiosIns.get<TradeRecordOut>("/trade/accept", {
      params: { trade_id },
    });
    return res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Cancel an active or pending transaction.
 *
 * @param trade_id - The ID of the trade to cancel.
 * @returns The updated Trade Record.
 */
export async function cancelTransaction(trade_id: number) {
  try {
    const res = await axiosIns.post<TradeRecordOut>("/trade/cancel", {
      trade_id,
    });
    return res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Confirm a transaction as the buyer or seller.
 *
 * @param trade_id - The ID of the trade to confirm.
 * @returns The updated Trade Record.
 */
export async function confirmTransaction(trade_id: number) {
  try {
    const res = await axiosIns.get<TradeRecordOut>("/trade/confirm", {
      params: { trade_id },
    });
    return res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * Get all transactions related to the current user.
 *
 * @param filter - Filters the trades based on their states (e.g., active, inactive, etc.).
 * @returns A list of Trade Records.
 */
export async function getTransactions(filter?: string[]) {
  try {
    const res = await axiosIns.get<TradeRecordOut[]>("/trade/get", {
      params: { filter },
    });
    return res.data;
  } catch (e) {
    apiErrorThrower(e);
  }
}

/**
 * SWR hook for fetching transactions.
 *
 * @param filter - Filters the trades based on their states (e.g., active, inactive, etc.).
 * @returns The SWR response containing Trade Records.
 */
export function useTradeRecords(filter?: string[]) {
  return useSWR(["/trade/get", filter], () => getTransactions(filter));
}
