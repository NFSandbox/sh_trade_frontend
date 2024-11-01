import Axios, { AxiosError, AxiosInstance } from 'axios';
import { apiErrorThrower } from '@/exceptions/error';

import * as gene_config from '@/config/general';
import toast from 'react-hot-toast';

export const axiosIns = Axios.create({
  baseURL: gene_config.backendBaseUrl,
  timeout: gene_config.backendRequestTimeoutMs,
  withCredentials: true,
});

axiosIns.interceptors.response.use(
  function (response) {
    if (response?.data?.detail?.error == true) {
      let e = {
        response: response,
      };
      return Promise.reject(e);
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });