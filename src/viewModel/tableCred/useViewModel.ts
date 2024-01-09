import { MyTableProps } from '@/types/customTypes';
import { useState } from 'react';

export default function useViewModel({ data }: MyTableProps) {
  const [dataSet, setDataSet] = useState<MyTableProps['data']>(data);

  const handleMoreActions = (type: string, id: number | string) => {
    console.log(type, id);
  };
  return {
    dataSet,
    handleMoreActions,
  };
}
