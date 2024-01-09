import React from 'react';
import Page from '@layouts/Page';
import Section from '@/layouts/Section';
import MyTableCred from '@/components/tableCred';
import { Box, Typography } from '@mui/material';
import { TableData } from '@/types/customTypes';

export default function index() {
  const tableData: TableData[] = [
    { id: 1, projectName: 'Loyalty App', user: 'spr_Otis', password: 'P@$$w0rd', disabled: true },
    { id: 2, projectName: 'Trecs', user: 'userB', password: 'passB', disabled: true },
    {
      id: 2,
      projectName: 'Central',
      user: 'billywong12@yopmail.com',
      password: 'P@$$w0rd1',
      disabled: true,
    },
  ];

  return (
    <Page title="Notes">
      <Section>
        <Box sx={{ p: 2 }}>
          <Box sx={{ width: '700px' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Credentials
            </Typography>
            <MyTableCred data={tableData} />
          </Box>
        </Box>
      </Section>
    </Page>
  );
}
