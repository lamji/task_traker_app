import instance from '@/utils/axios';

export const getData = async (params: any) => {
  return instance.get('/rows', { params });
};

export const postData = async (data: any) => {
  try {
    const response = await instance.post('/rows', data);
    return response.data;
  } catch (error) {
    // Handle error or throw it to the calling code
    throw error;
  }
};

export const putData = async (id: any, data: any) => {
  try {
    const response = await instance.put(`/rows/${id}`, data);
    return response.data;
  } catch (error) {
    // Handle error or throw it to the calling code
    throw error;
  }
};
