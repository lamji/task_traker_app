/** @format */

import { useState } from 'react';
import {
  format,
  subMonths,
  addMonths,
  startOfWeek,
  addDays,
  isSameDay,
  lastDayOfWeek,
  getWeek,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { Button, Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import moment from 'moment/moment';

const Calendar = ({ showDetailsHandle }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState(getWeek(currentMonth));
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Assuming currentMonth is set to one week before the current date
  const currentMonthMoment = moment().subtract(1, 'weeks');

  // Get the next month from the currentMonth
  const nextMonth = currentMonthMoment.clone().add(1, 'months');
  const previousMonth = currentMonthMoment.clone().subtract(1, 'months');

  const changeMonthHandle = (btnType) => {
    if (btnType === 'prev') {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    if (btnType === 'next') {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  const changeWeekHandle = (btnType) => {
    if (btnType === 'prev') {
      setCurrentMonth(subWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(subWeeks(currentMonth, 1)));
    }
    if (btnType === 'next') {
      setCurrentMonth(addWeeks(currentMonth, 1));
      setCurrentWeek(getWeek(addWeeks(currentMonth, 1)));
    }
  };

  const onDateClickHandle = (day, dayStr) => {
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const renderHeader = () => {
    const dateFormat = 'MMM yyyy';

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <Button
            variant="text"
            startIcon={<ArrowBackIosIcon style={{ fontSize: '14px' }} />}
            onClick={() => changeMonthHandle('prev')}
            sx={{ fontSize: '12px' }}
          >
            {previousMonth.format('MMMM')}
          </Button>
        </div>
        <div className="col col-center">
          <span>{format(currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end">
          <Button
            variant="text"
            endIcon={<ArrowForwardIosIcon style={{ fontSize: '14px' }} />}
            onClick={() => changeMonthHandle('next')}
            sx={{ fontSize: '12px' }}
          >
            {nextMonth.format('MMMM')}
          </Button>
        </div>
      </div>
    );
  };
  const renderDays = () => {
    const dateFormat = 'EEE';
    const days = [];
    let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={`col col-center`} key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>,
      );
    }
    return <div className="days row">{days}</div>;
  };
  const renderCells = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell`}
            key={day}
            onClick={() => {
              const dayStr = format(cloneDay, 'ccc dd MMM yy');
              onDateClickHandle(cloneDay, dayStr);
            }}
          >
            <span
              className={`number ${
                isSameDay(day, new Date())
                  ? 'today'
                  : isSameDay(day, selectedDate)
                  ? 'selected'
                  : ''
              }`}
            >
              {formattedDate}
            </span>
          </div>,
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };
  const renderFooter = () => {
    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={() => changeWeekHandle('prev')}>
            prev week
          </div>
        </div>
        <div className="col col-end" onClick={() => changeWeekHandle('next')}>
          <div className="icon">next week</div>
        </div>
      </div>
    );
  };
  return (
    <div className="calendar">
      {renderHeader()}
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton onClick={() => changeWeekHandle('prev')} sx={{ fontSize: '12px' }}>
          <ArrowBackIosIcon />
        </IconButton>
        <Box sx={{ width: '100%' }}>
          {renderDays()}
          {renderCells()}
        </Box>
        <IconButton onClick={() => changeWeekHandle('next')} sx={{ fontSize: '12px' }}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* {renderFooter()} */}
    </div>
  );
};

export default Calendar;
/**
 * Header:
 * icon for switching to the previous month,
 * formatted date showing current month and year,
 * another icon for switching to next month
 * icons should also handle onClick events to change a month
 */
