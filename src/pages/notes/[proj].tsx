import React from 'react';
import Page from '@layouts/Page';
import Section from '@/layouts/Section';
import MyTableCred from '@/components/tableCred';
import { Box, Typography } from '@mui/material';

interface TableData {
  projectName: string;
  user: string;
  password: string;
}

export default function index() {
  const tableData: TableData[] = [
    { projectName: 'Loyalty App', user: 'spr_Otis', password: 'P@$$w0rd' },
    { projectName: 'Trecs', user: 'userB', password: 'passB' },
  ];

  return (
    <Page title="Notes">
      <Section>
        <Box sx={{ p: 2 }}>
          <Box sx={{ width: '500px' }}>
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
