// @ts-nocheck
import React, { useState, ChangeEvent, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  Typography,
  Box,
} from '@mui/material';

import DescriptionIcon from '@mui/icons-material/Description';
import 'react-quill/dist/quill.snow.css'; // Import the styles

// ... (other imports)

import dynamic from 'next/dynamic';
import moment from 'moment';
import { getData, postData, putData, deleteData } from '@/common/apiHooks';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import tableStyles from './tableStyles';

const ReactQuill = dynamic(() => import('react-quill'), {
  loading: () => <p>Loading ReactQuill...</p>,
  ssr: false, // This is important to prevent server-side rendering errors
});

const Calendar = dynamic(() => import('@components/Calendar/calendar'), {
  loading: () => <p>Loading ReactQuill...</p>,
  ssr: false, // This is important to prevent server-side rendering errors
});

interface Row {
  id: number;
  name: string;
  ticket: string;
  time_start: string;
  time_end: string;
  tracker: string;
  status: string;
  notes: string;
  _id?: any;
}

const EditableTable: React.FC = () => {
  const classes = tableStyles();
  const [data, setData] = useState<Row[]>([]);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState('');
  const [watcher, setWatcher] = useState(false);
  const [dateNow, setDateNow] = useState(moment().format('LL'));
  const [timeTracker, setTimeTracker] = useState('');
  const isToday = moment().format('LL') === dateNow;
  const showDetailsHandle = (dayStr: any) => {
    setDateNow(moment(dayStr).format('LL'));
  };

  const handleAddRow = async () => {
    const newData = {
      id: Date.now(),
      name: '',
      ticket: '',
      time_start: '',
      time_end: '',
      tracker: '',
      status: 'Not Logged',
      notes: '',
    };

    setData((prevData) => [...prevData, newData]);

    try {
      const res = await postData(newData);
      console.log(res); // Handle the response as needed
    } catch (error) {
      console.error(error); // Handle the error as needed
    }
  };

  const handleEdit = async (id: number, field: keyof Row, value: string | number) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row._id === id) {
          const updatedRow = { ...row, [field]: value };

          if (field === 'time_start' || field === 'time_end') {
            const timeStart = new Date(updatedRow.time_start).getTime();
            const timeEnd = new Date(updatedRow.time_end).getTime();
            const differenceInSeconds = (timeEnd - timeStart) / 1000;

            const hours = Math.floor(differenceInSeconds / 3600);
            const minutes = Math.floor((differenceInSeconds % 3600) / 60);
            const seconds = Math.floor(differenceInSeconds % 60);

            updatedRow.tracker = `${hours}:${minutes}:${seconds}`;

            try {
              const trackerData = {
                tracker: updatedRow.tracker,
              };
              putData(id, trackerData);
            } catch (error) {}
            setTimeTracker(updatedRow.tracker);
          }

          return updatedRow;
        }
        return row;
      }),
    );

    /**
     * handle update
     */

    setTimeout(async () => {
      const updatedData = {
        [field]: value,
        tracker: timeTracker,
      };
      try {
        await putData(id, updatedData);
      } catch (error) {
        console.log(error);
      }
    }, 2000);
  };

  const calculateTotalTime = () => {
    const totalSeconds = data
      .filter((row) => row.tracker !== '')
      .reduce((acc, row) => {
        const [hours, minutes, seconds] = row.tracker.split(':').map(Number);
        return acc + hours * 3600 + minutes * 60 + seconds;
      }, 0);

    if (!Number.isNaN(totalSeconds) && Number.isFinite(totalSeconds)) {
      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
      const totalSecondsRemaining = Math.floor(totalSeconds % 60);

      return `  ${totalHours}:${totalMinutes}:${totalSecondsRemaining}`;
    } else {
      return 'Calculating...'; // Display an empty string or a default message
    }
  };

  const handleOpenDrawer = (row: Row) => {
    setSelectedRow(row);
    setDrawerOpen(true);
    setValue(row?.notes);
  };

  const handleCloseDrawer = () => {
    setSelectedRow(null);
    setDrawerOpen(false);
    handleEdit(selectedRow?._id as number, 'notes', value);
  };

  const handleGetData = async () => {
    const params = {
      created_at: moment(dateNow, 'MMMM DD, YYYY').format() || undefined,
      // created_at: undefined,
    };
    try {
      const { data } = await getData(params);
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: any) => {
    try {
      await deleteData(id);
      setWatcher(!watcher);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [dateNow, watcher]);

  return (
    <div>
      <Typography
        variant="h4"
        fontWeight={700}
        pt={4}
        sx={{ position: 'fixed', background: 'white', width: '100%', zIndex: 999 }}
      >
        TIME:{calculateTotalTime()}
      </Typography>
      <Typography
        sx={{
          position: 'fixed',
          marginTop: '70px',
          marginLeft: '5px',
          background: 'white',
          width: '100%',
          zIndex: 998,
        }}
      >
        {dateNow}{' '}
      </Typography>
      <Box sx={{ width: '500px', margin: '80px auto 10px auto' }}>
        <Calendar showDetailsHandle={showDetailsHandle} />
      </Box>
      {data.length === 0 ? (
        <>
          <Box sx={{ textAlign: 'center' }}>
            <Typography>No Records</Typography>
            {isToday && (
              <Button
                variant="contained"
                onClick={handleAddRow}
                sx={{
                  color: 'black',
                  mt: 2,
                  mb: 5,
                  '&:hover': {
                    background: 'white',
                  },
                }}
              >
                Add Row
              </Button>
            )}
          </Box>
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Ticket</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Tracker</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="text"
                      value={row.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEdit(row._id, 'name', e.target.value)
                      }
                      sx={{
                        width: '300px',
                      }}
                      InputProps={{
                        style: {
                          border: 'none',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="text"
                      value={row.ticket}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEdit(row._id, 'ticket', e.target.value)
                      }
                      sx={{
                        width: '110px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="datetime-local"
                      value={moment(row.time_start as string).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEdit(row._id, 'time_start', e.target.value)
                      }
                      sx={{
                        width: '220px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="datetime-local"
                      value={moment(row.time_end as string).format('YYYY-MM-DDTHH:mm')}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEdit(row._id, 'time_end', e.target.value)
                      }
                      sx={{
                        width: '220px',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="text"
                      value={row.tracker || '00:00:00'}
                      disabled
                      sx={{
                        width: '110px',
                        '.MuiInputBase-input': {
                          textAlign: 'center',
                          fontWeight: 700,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <Select
                      value={row.status}
                      onChange={(e: any) => handleEdit(row._id, 'status', e.target.value as string)}
                      sx={{
                        width: '150px',
                        backgroundColor: row.status === 'Logged' ? '#6db599' : '#e0e0e0',
                        color: row.status === 'Logged' ? 'white' : 'black',
                      }}
                    >
                      <MenuItem value="Logged">Logged</MenuItem>
                      <MenuItem value="Not Logged">Not Logged</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <IconButton onClick={() => handleOpenDrawer(row)}>
                      <DescriptionIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <IconButton onClick={() => deleteItem(row._id)}>
                      <CloseOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        <div style={{ width: '500px', padding: '10px' }}>
          <Typography variant="h5" sx={{ my: 2, fontWeight: 700 }}>
            {selectedRow?.ticket} - {selectedRow?.name}
          </Typography>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={(value) => {
              setValue(value);
            }}
            style={{ height: '400px' }}
          />
        </div>
      </Drawer>

      {data.length !== 0 && isToday && (
        <Button
          variant="contained"
          onClick={handleAddRow}
          sx={{
            color: 'black',
            mt: 2,
            mb: 5,
            '&:hover': {
              background: 'white',
            },
          }}
        >
          Add Row
        </Button>
      )}
    </div>
  );
};

export default EditableTable;
