/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from '@/utils/axios';

export const getData = async (params: any) => {
  return instance.get('/rows', { params });
};

export const postData = async (data: any) => {
  const response = await instance.post('/rows', data);
  return response.data;
};

export const putData = async (id: any, data: any) => {
  const response = await instance.put(`/rows/${id}`, data);
  return response.data;
};
