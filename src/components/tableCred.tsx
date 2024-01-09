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
import useStyles from '@/styles/MyTableCred/useStyles';
import DynamicMenu from './DynamicMenu';
import { MyTableProps } from '@/types/customTypes';
import useViewModel from '@/viewModel/tableCred/useViewModel';

const MyTableCred: React.FC<MyTableProps> = ({ data }) => {
  const MODEL = useViewModel({ data });
  const classes = useStyles();
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
          {MODEL?.dataSet.map((row, index) => (
            <TableRow key={index}>
              <TableCell sx={classes.projectName}>
                <TextField
                  variant="outlined"
                  value={row.projectName}
                  fullWidth
                  size="small"
                  disabled={row?.disabled}
                />
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #cacaca', p: '10px' }}>
                <TextField
                  variant="outlined"
                  value={row.user}
                  fullWidth
                  size="small"
                  disabled={row?.disabled}
                />
              </TableCell>
              <TableCell sx={{ borderRight: '1px solid #cacaca', p: '10px' }}>
                <TextField
                  variant="outlined"
                  value={row.password}
                  fullWidth
                  size="small"
                  disabled={row?.disabled}
                />
              </TableCell>
              <TableCell>
                <DynamicMenu dataOut={(i: string) => MODEL?.handleMoreActions(i, row?.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTableCred;
