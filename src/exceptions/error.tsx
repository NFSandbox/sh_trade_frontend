import toast from "react-hot-toast";
import { message } from "antd";

export class BaseError extends Error {
  name: string;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
}

export class ParamError extends BaseError {
  constructor(message: string) {
    super("param_error", message);
  }
}

export class NetworkError extends BaseError {
  constructor() {
    super(
      "network_error",
      "Network error occurred, " +
        "please check your Internet connection or maybe there is error occurred at server side."
    );
  }
}

/**
 * Try to extract the error info from a Axios response if the error exists.
 */
export function getBackendErrorFromResponse(
  response: any
): BaseError | undefined {
  try {
    if (response.data.detail.error === true) {
      const name = response.data.detail.name;
      const message = response.data.detail.message;
      return new BaseError(name, message);
    }
  } catch (e) {
    return undefined;
  }
}

/**
 * Error thrower used by function that do api request.
 * @param e The error need to be parsed and throw.
 */
export function apiErrorThrower(e: any): never {
  // if error contains response
  if (e.response) {
    // try get a standard backend error
    const backendError = getBackendErrorFromResponse(e.response);
    if (backendError !== undefined) {
      throw backendError;
    }

    // if backend doesn't give any further info
    // throw request_error
    if (!e.response.data) {
      throw new BaseError(
        "request_error",
        `成功向服务器发送了请求，但返回值无效，请联系网站管理员。错误详情：${
          e.message ?? "未知错误信息"
        }`
      );
    }

    // backend has data info, but not in standard type (with name and message key)
    // throw backend_error with detail itself as message
    throw new BaseError(
      "backend_error",
      `成功向服务器发送了请求，但服务器返回了非标准错误，请联系网站管理员。错误详情：${JSON.stringify(
        e.response.data.detail
      )}`
    );
  }

  // if it's axios network error
  if (e.message == "Network Error") {
    throw new NetworkError();
  }

  // If not axios error, throw unknown error
  throw new BaseError(
    "unknown_error",
    "Error occurred when requesting API: " + e.message
  );
}

export function errorPopper(e: any) {
  toast.error(errorStringifier(e));
}

/**
 * Provide a unified error stringify method for this application.
 *
 * This function should both handle BaseError and any other kinds of error.
 */
export function errorStringifier(e: any) {
  if (e.name !== undefined && e.message !== undefined) {
    return `${e.message} (${e.name})`;
  } else {
    return e.message ?? "发生未知错误，且该错误没有提供额外信息";
  }
}
