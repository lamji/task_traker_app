export interface TableData {
  id: number | string;
  projectName: string;
  user: string;
  password: string;
  disabled: boolean;
}

export interface MyTableProps {
  data: TableData[];
}
