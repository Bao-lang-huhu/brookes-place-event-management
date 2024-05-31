import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { database } from '../firebase';

function EventList() {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editEventData, setEditEventData] = useState({
    customerName: '',
    username: '',
    date: '',
    time: '',
    status: 'pending'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sortedEvents = Object.entries(data).map(([id, event]) => ({
          id,
          ...event
        })).sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sortedEvents);
      }
    });
  }, []);

  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setEditEventData({
      customerName: event.customerName,
      username: event.username,
      date: event.date,
      time: event.time,
      status: event.status
    });
  };

  const handleChange = (e) => {
    setEditEventData({
      ...editEventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveClick = async () => {
    const confirmAction = window.confirm("Do you want to save the changes?");
    if (!confirmAction) {
      return;
    }

    try {
      await update(ref(database, `events/${editEventId}`), editEventData);
      setMessage('Event updated successfully!');
      setEditEventId(null);
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(`Failed to update event: ${error.message}`);
    }
  };

  const handleDeleteClick = async (eventId) => {
    const confirmAction = window.confirm("Do you really want to delete this event?");
    if (!confirmAction) {
      return;
    }

    try {
      await remove(ref(database, `events/${eventId}`));
      setMessage('Event deleted successfully!');
      setTimeout(() => {
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage(`Failed to delete event: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Event List</h2>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Username</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="text"
                    name="customerName"
                    value={editEventData.customerName}
                    onChange={handleChange}
                  />
                ) : (
                  event.customerName
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="text"
                    name="username"
                    value={editEventData.username}
                    onChange={handleChange}
                  />
                ) : (
                  event.username
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="date"
                    name="date"
                    value={editEventData.date}
                    onChange={handleChange}
                  />
                ) : (
                  event.date
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="time"
                    name="time"
                    value={editEventData.time}
                    onChange={handleChange}
                  />
                ) : (
                  event.time
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <select
                    name="status"
                    value={editEventData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                ) : (
                  event.status
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={() => setEditEventId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(event)}>Edit</button>
                    <button onClick={() => handleDeleteClick(event.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventList;
