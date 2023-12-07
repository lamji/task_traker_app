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
  InputAdornment,
  Tooltip,
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import CloudDoneIcon from '@mui/icons-material/CloudDone';

import DescriptionIcon from '@mui/icons-material/Description';
import 'react-quill/dist/quill.snow.css'; // Import the styles

// ... (other imports)

import dynamic from 'next/dynamic';
import moment from 'moment';
import { getData, postData, putData, deleteData } from '@/common/apiHooks';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddIcon from '@mui/icons-material/Add';
import tableStyles from './tableStyles';
import helper from './helper';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState('');
  const [watcher, setWatcher] = useState(false);
  const [dateNow, setDateNow] = useState(moment().format('LL'));
  const [timeTracker, setTimeTracker] = useState('');
  const isAddButtonDisabled = moment(dateNow, 'MMMM DD, YYYY').isAfter(moment(), 'day');
  const showDetailsHandle = (dayStr: any) => {
    setDateNow(moment(dayStr).format('LL'));
  };
  console.log('helper', helper());
  const { status } = helper();

  const handleAddRow = async () => {
    const newDataLocal = {
      id: Date.now(),
      name: '',
      ticket: '',
      time_start: '',
      time_end: '',
      tracker: '',
      status: 'Not Logged',
      notes: '',
      isSaving: 'not_saved',
      created_at: moment(dateNow, 'MMMM DD, YYYY').startOf('day').utc().format(),
    };

    const newData = {
      id: Date.now(),
      name: '',
      ticket: '',
      time_start: '',
      time_end: '',
      tracker: '',
      status: 'Not Logged',
      notes: '',
      created_at: moment(dateNow, 'MMMM DD, YYYY').startOf('day').utc().format(),
    };

    setData((prevData) => [...prevData, newDataLocal]);

    try {
      await postData(newData);
      setWatcher(!watcher);
    } catch (error) {
      console.error(error); // Handle the error as needed
    }
  };

  const handleEdit = async (id: number, field: keyof Row, value: string | number) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row._id === id) {
          const updatedRow = { ...row, [field]: value };
          updatedRow.isSaving = 'not_saved';

          if (field === 'time_start' || field === 'time_end') {
            const timeStart = new Date(updatedRow.time_start).getTime();
            const timeEnd = new Date(updatedRow.time_end).getTime();
            const differenceInSeconds = (timeEnd - timeStart) / 1000;

            const hours = Math.floor(differenceInSeconds / 3600);
            const minutes = Math.floor((differenceInSeconds % 3600) / 60);
            const seconds = Math.floor(differenceInSeconds % 60);

            updatedRow.tracker = `${hours}:${minutes}:${seconds}`;
          }

          return updatedRow;
        }
        return row;
      }),
    );
  };

  const handleEditSave = async (id: number, field: keyof Row, value: string | number) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row._id === id) {
          const updatedRow = { ...row, [field]: value };

          return updatedRow;
        }
        return row;
      }),
    );
  };

  const handleSaved = async (row: any) => {
    console.log('row', row);
    // setIsLoading(true);
    handleEditSave(row._id, 'isSaving', 'saving');
    const updatedData = {
      id: row?.id,
      name: row?.name,
      ticket: row?.ticket,
      time_start: row?.time_start,
      time_end: row?.time_end,
      tracker: row?.tracker,
      status: row?.status,
      notes: row?.notes,
    };
    try {
      await putData(row._id, updatedData);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        handleEditSave(row._id, 'isSaving', 'saved');
      }, 500);
    }
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
      created_at: moment(dateNow, 'MMMM DD, YYYY').startOf('day').utc().format() || undefined,
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
    <div style={{ width: '1419px' }}>
      <Box sx={{ width: '500px', margin: '10px auto 10px auto' }}>
        <Calendar showDetailsHandle={showDetailsHandle} />
      </Box>
      {data.length === 0 ? (
        <>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography>No Records</Typography>
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
                <TableCell>Save</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row._id}>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      type="text"
                      size="small"
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
                      size="small"
                      value={row.ticket}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEdit(row._id, 'ticket', e.target.value)
                      }
                      sx={{
                        width: '150px',
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography
                              sx={{
                                background: '#A9A9A9',
                                color: 'white',
                                fontSize: '12px',
                                height: '20px',
                                width: '20px',
                                borderRadius: '50px',
                              }}
                            ></Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <TextField
                      size="small"
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
                      size="small"
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
                      size="small"
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
                      size="small"
                      value={row.status}
                      onChange={(e: any) => handleEdit(row._id, 'status', e.target.value as string)}
                      sx={{
                        width: '150px',
                        backgroundColor: row.status === 'Logged' ? '#6db599' : '#e0e0e0',
                        color: row.status === 'Logged' ? 'white' : 'black',
                      }}
                    >
                      <MenuItem
                        value="Logged"
                        sx={{
                          background: '#6db599',
                          m: '10px',
                          color: 'white',
                          borderRadius: '5px',
                          '&:hover': {
                            background: '#6db599',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#6db599 !important',
                          },
                        }}
                      >
                        Logged
                      </MenuItem>
                      <MenuItem
                        value="Not Logged"
                        sx={{
                          backgroundColor: '#e0e0e0',
                          m: '10px',
                          color: 'black',
                          borderRadius: '5px',
                          '&:hover': {
                            backgroundColor: '#e0e0e0',
                          },
                          '&.Mui-selected': {
                            backgroundColor: '#e0e0e0 !important',
                          },
                        }}
                      >
                        Not Logged
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <IconButton onClick={() => handleOpenDrawer(row)}>
                      <DescriptionIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell sx={classes.tabCell}>
                    <IconButton onClick={() => handleSaved(row)}>
                      {row?.isSaving ? (
                        row?.isSaving === 'saving' ? (
                          <Typography sx={{ fontSize: '9px' }}>Saving...</Typography>
                        ) : row?.isSaving === 'not_saved' ? (
                          <AddTaskIcon />
                        ) : (
                          <CloudDoneIcon />
                        )
                      ) : (
                        <CloudDoneIcon />
                      )}
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
      <Box sx={{ y: 2, borderTop: '1px solid grey', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            p: '10px',
            borderRight: '1px solid gray',
            borderRadius: '70% 30% 100% 0% / 0% 100% 0% 100% ',
            width: '60%',
          }}
        >
          <IconButton onClick={handleAddRow} disabled={isAddButtonDisabled}>
            <AddIcon style={{ fontSize: '50px' }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            borderBottom: '1px solid grey',
            borderRight: '1px solid grey',
            width: '40%',
            p: 1,
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '28px', ml: 3 }}>
                {calculateTotalTime()}
              </Typography>
              <Typography sx={{ ml: 3 }}> {dateNow} </Typography>
            </Box>

            <Box sx={{ ml: 3, mt: '20px', textAlign: 'center', display: 'flex' }}>
              {status.map((data) => (
                <Tooltip key={data.key} title={data.label} arrow>
                  <Box ml={2}>
                    <Box
                      sx={{
                        background: data.color,
                        color: 'white',
                        fontSize: '12px',
                        height: '20px',
                        width: '20px',
                        borderRadius: '50px',
                      }}
                    />
                    <Typography sx={{ textTransform: 'uppercase', fontSize: '12px', mt: '5px' }}>
                      {data.key}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: '50px' }}></Box>
    </div>
  );
};

export default EditableTable;
