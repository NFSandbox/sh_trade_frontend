import Axios, { AxiosError, AxiosInstance } from "axios";
import { apiErrorThrower } from "@/exceptions/error";

import * as gene_config from "@/config/general";
import toast from "react-hot-toast";

// Tools
import { asyncSleep } from "@/tools/general";

export const axiosIns = Axios.create({
  baseURL: gene_config.backendBaseUrl,
  timeout: gene_config.backendRequestTimeoutMs,
  withCredentials: true,
});

axiosIns.interceptors.response.use(
  async function (response) {
    if (response?.data?.detail?.error == true) {
      let e = {
        response: response,
      };
      throw e;
    }
    if (gene_config.apiRequestSimulatedDelay > 0) {
      toast(
        `[DEBUG] Simulated API Request Delay On... Delay: ${gene_config.apiRequestSimulatedDelay}`,
      );
    }
    await asyncSleep(gene_config.apiRequestSimulatedDelay);
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);
