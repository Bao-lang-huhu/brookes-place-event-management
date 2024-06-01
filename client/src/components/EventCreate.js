import React, { useState } from 'react';
import { ref, push, set, get } from 'firebase/database';
import { database } from '../firebase';

function EventCreate() {
  const [customerName, setCustomerName] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('pending');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const confirmAction = window.confirm("Do you want to add this event?");
    if (!confirmAction) {
      return;
    }

    try {
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      const eventsData = snapshot.val();

      if (eventsData) {
        const eventsOnSameDate = Object.values(eventsData).filter(event => event.date === date);
        const hasConflict = eventsOnSameDate.some(event => {
          const eventStart = new Date(`${event.date}T${event.startTime}`);
          const eventEnd = new Date(`${event.date}T${event.endTime}`);
          const newEventStart = new Date(`${date}T${startTime}`);
          const newEventEnd = new Date(`${date}T${endTime}`);
          return (newEventStart < eventEnd && newEventEnd > eventStart);
        });

        if (hasConflict) {
          setMessage('There is a time conflict with another event on the same date.');
          return;
        }
      }

      const newEventRef = push(eventsRef);
      await set(newEventRef, {
        customerName: customerName,
        username: username,
        date: date,
        startTime: startTime,
        endTime: endTime,
        status: status,
        userId: userId || null  // Allow userId to be null if not provided
      });

      setMessage('Event added successfully!');
      setCustomerName('');
      setUsername('');
      setDate('');
      setStartTime('');
      setEndTime('');
      setStatus('pending');
      setUserId('');
    } catch (error) {
      setMessage(`Failed to add event: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="pending">Pending</option>
          <option value="Booked">Booked</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID (optional)"
        />
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}

export default EventCreate;
