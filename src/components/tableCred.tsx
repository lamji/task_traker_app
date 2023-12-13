// MyTableCred.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';

interface TableData {
  projectName: string;
  user: string;
  password: string;
}

interface MyTableProps {
  data: TableData[];
}

const MyTableCred: React.FC<MyTableProps> = ({ data }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #cacaca' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Password</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell
                sx={{
                  borderRight: '1px solid #cacaca',
                  width: '150px',
                  fontWeight: 700,
                  p: '10px',
                }}
              >
                <TextField
                  variant="outlined"
                  value={row.projectName}
                  fullWidth
                  size="small"
                  disabled
                />
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #cacaca', p: '10px' }}>
                <TextField variant="outlined" value={row.user} fullWidth size="small" disabled />
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #cacaca', p: '10px' }}>
                <TextField
                  variant="outlined"
                  value={row.password}
                  fullWidth
                  size="small"
                  disabled
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTableCred;
