import React, { useState, useEffect } from 'react';
import './EventForm.css';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@material-ui/core';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const EventForm = () => {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [recurringDays, setRecurringDays] = useState([]);
  const [addedEvents, setAddedEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setAddedEvents(JSON.parse(storedEvents));
    }
  }, []);

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleRecurringDaysChange = (event) => {
    const selectedDays = Array.from(event.target.value, (option) => option);
    setRecurringDays(selectedDays);
  };

  const handleAddEvent = () => {
    if (!eventName || !startDate || !endDate || recurringDays.length === 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    const newEvent = {
      eventName,
      startDate,
      endDate,
      recurringDays,
    };
    const updatedEvents = [...addedEvents, newEvent];
    setAddedEvents(updatedEvents);

    // Reset form fields
    setEventName('');
    setStartDate('');
    setEndDate('');
    setRecurringDays([]);

    // Store events in local storage
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Show success toast
    MySwal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', MySwal.stopTimer);
        toast.addEventListener('mouseleave', MySwal.resumeTimer);
      },
    }).fire({
      icon: 'success',
      title: 'Event added successfully!',
    });
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = addedEvents.filter((_, i) => i !== index);
    setAddedEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // Show delete toast
    MySwal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      onOpen: (toast) => {
        toast.addEventListener('mouseenter', MySwal.stopTimer);
        toast.addEventListener('mouseleave', MySwal.resumeTimer);
      },
    }).fire({
      icon: 'success',
      title: 'Event deleted successfully!',
    });
  };

  return (
    <div className="event-form-container">
      <h2 className="event-form-heading">Event Form</h2>
      <Grid className="form" container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Event Name"
            value={eventName}
            onChange={handleEventNameChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Recurring Days</InputLabel>
            <Select
              multiple
              value={recurringDays}
              onChange={handleRecurringDaysChange}
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
              <MenuItem value="Saturday">Saturday</MenuItem>
              <MenuItem value="Sunday">Sunday</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEvent}
            className="add-event-button"
          >
            Add Event
          </Button>
        </Grid>
      </Grid>

      <h3 className="added-events-heading">Added Events:</h3>
      {addedEvents.map((event, index) => (
        <div key={index} className="added-event">
          <div>
            <p>
              <strong>Event Name:</strong> {event.eventName}
            </p>
            <p>
              <strong>Start Date:</strong> {event.startDate}
            </p>
          </div>
          <div>
            <p>
              <strong>End Date:</strong> {event.endDate}
            </p>
            <p>
              <strong>Recurring Days:</strong> {event.recurringDays.join(', ')}
            </p>
          </div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDeleteEvent(index)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};

export default EventForm;
