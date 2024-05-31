import React, { useState } from 'react';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase';

function EventCreate() {
  const [customerName, setCustomerName] = useState('');
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [status, setStatus] = useState('pending');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const confirmAction = window.confirm("Do you want to add this event?");
    if (!confirmAction) {
      return;
    }

    try {
      const eventsRef = ref(database, 'events');
      const newEventRef = push(eventsRef);
      await set(newEventRef, {
        customerName: customerName,
        username: username,
        date: date,
        time: time,
        status: status,
        userId: userId || null  // Allow userId to be null if not provided
      });

      setMessage('Event added successfully!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
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
          value={time}
          onChange={(e) => setTime(e.target.value)}
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
