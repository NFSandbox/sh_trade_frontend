import { ReactNode, useState } from "react";

import * as dayjs from "dayjs";
import toast from "react-hot-toast";
import { ValueOrFunction, Renderable } from "react-hot-toast";

import {
  apiErrorThrower,
  errorPopper,
  errorStringifier,
} from "@/exceptions/error";

/**
 * Get the key of an object by its value
 */
export function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find((k) => object[k] === value);
}

/**
 * Async sleep a certian time
 * @param sleepMs Sleep time in milliseconds
 */
export async function asyncSleep(sleepMs: number): Promise<void> {
  await new Promise((r) => setTimeout(r, sleepMs));
  return;
}

/**
 * Convert timestamp to readable format (YYYY-MM-DD HH:mm:ss)
 * @param timestamp The current timestamp (int millisecond)
 */
export function convertTimeStampToReadable(timestamp: number) {
  return dayjs.unix(timestamp / 1000).format("YYYY-MM-DD HH:mm:ss");
}

/**
 * Return true if the current running environment is browser-like,
 */
export function inBrowserEnv(): boolean {
  return typeof window !== "undefined";
}

/**
 * Custom react-hot-toast wrapper with custom error rendering function.
 */
export function promiseToastWithBaseErrorHandling<T>(
  promise: Promise<T>,
  loading: Renderable,
  success: ValueOrFunction<Renderable, T>
): Promise<T> {
  return toast.promise(promise, {
    success: success,
    loading: loading,
    error: (e) => errorStringifier(e),
  });
}

type AsyncFunction = (...args: any) => Promise<any>;

/**
 * Extract the awaited return type of an async function
 */
type AwaitedReturnType<FuncType extends AsyncFunction> =
  ReturnType<FuncType> extends Promise<infer Ret> ? Ret : never;

/**
 * Function wrapper that used to trigger an async function with a maintained loading state.
 *
 * This function will handle the following things automatically:
 *
 * - A React `isLoading` state. Set to true while task is running.
 * - Error popper when error occured in the async task.
 *
 * Return:
 * - Return the value that returned by the async task.
 * - If error, return `undefined`
 *
 * Usage:
 *
 * ```
 * function Component() {
 *   const { task, isLoading } = useAsyncTaskWithLoadingState(async () => {
 *     await someAsyncTask();
 *   });
 *
 *   return (
 *     <button onClick={task} disabled={isLoading}>
 *       Click Me
 *     </button>
 *   );
 * }
 * ```
 */
export function useAsyncTaskWithLoadingState<Func extends AsyncFunction>(
  task: Func
) {
  const [isLoading, setIsLoading] = useState(false);

  async function asyncTaskWrapper(
    ...args: Parameters<Func>
  ): Promise<AwaitedReturnType<Func> | undefined> {
    setIsLoading(true);
    try {
      // here we must await this async task, so that the following catch block could get the error
      // that occured in the async task() function.
      return await task(...args);
    } catch (e) {
      errorPopper(e);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    task: asyncTaskWrapper,
    isLoading,
  };
}
