import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

const onRequest = async (config: AxiosRequestConfig) => {
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error?.response?.data);
};

const onResponse = (response: AxiosResponse) => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error?.response?.data);
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
instance.interceptors.request.use(onRequest, onRequestError);
instance.interceptors.response.use(onResponse, onResponseError);

export default instance;
