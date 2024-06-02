import React, { useState, useEffect } from 'react';
import { ref, onValue, update, remove, get } from 'firebase/database';
import { database } from '../firebase';

function EventList() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null);
  const [editEventData, setEditEventData] = useState({
    customerName: '',
    username: '',
    date: '',
    startTime: '',
    endTime: '',
    status: 'pending',
    userId: ''
  });
  const [message, setMessage] = useState('');
  const [searchField, setSearchField] = useState('');
  const [searchValue, setSearchValue] = useState('');

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
        setFilteredEvents(sortedEvents);
      }
    });
  }, []);

  const handleEditClick = (event) => {
    setEditEventId(event.id);
    setEditEventData({
      customerName: event.customerName,
      username: event.username,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      status: event.status,
      userId: event.userId || ''
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
      const eventsRef = ref(database, 'events');
      const snapshot = await get(eventsRef);
      const eventsData = snapshot.val();

      if (eventsData) {
        const eventsOnSameDate = Object.values(eventsData).filter(event => event.date === editEventData.date && event.id !== editEventId);
        const hasConflict = eventsOnSameDate.some(event => {
          const eventStart = new Date(`${event.date}T${event.startTime}`);
          const eventEnd = new Date(`${event.date}T${event.endTime}`);
          const newEventStart = new Date(`${editEventData.date}T${editEventData.startTime}`);
          const newEventEnd = new Date(`${editEventData.date}T${editEventData.endTime}`);
          return (newEventStart < eventEnd && newEventEnd > eventStart);
        });

        if (hasConflict) {
          setMessage('There is a time conflict with another event on the same date.');
          return;
        }
      }

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

  const handleSearch = () => {
    if (!searchField || !searchValue) {
      setMessage('Please select a search filter and enter a search value.');
      return;
    }

    const filtered = events.filter(event => {
      const fieldValue = event[searchField].toString().toLowerCase();
      return fieldValue.includes(searchValue.toLowerCase());
    });

    setFilteredEvents(filtered);

    if (filtered.length > 0) {
      setMessage('Search successful!');
    } else {
      setMessage('No events found matching the search criteria.');
    }
  };

  const handleRefresh = () => {
    setFilteredEvents(events);
    setSearchField('');
    setSearchValue('');
    setMessage('Event list refreshed.');
    setTimeout(() => {
      setMessage('');
    }, 2000);
  };

  return (
    <div>
      <h2>Event List</h2>
      {message && <p>{message}</p>}
      <div>
        <select onChange={(e) => setSearchField(e.target.value)} value={searchField}>
          <option value="">Select Filter</option>
          <option value="customerName">Customer Name</option>
          <option value="username">Username</option>
          <option value="date">Date</option>
          <option value="startTime">Start Time</option>
          <option value="endTime">End Time</option>
          <option value="status">Status</option>
          <option value="userId">User ID</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleRefresh}>Refresh</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Username</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
            <th>User ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
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
                    name="startTime"
                    value={editEventData.startTime}
                    onChange={handleChange}
                  />
                ) : (
                  event.startTime
                )}
              </td>
              <td>
                {editEventId === event.id ? (
                  <input
                    type="time"
                    name="endTime"
                    value={editEventData.endTime}
                    onChange={handleChange}
                  />
                ) : (
                  event.endTime
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
                  <input
                    type="text"
                    name="userId"
                    value={editEventData.userId}
                    onChange={handleChange}
                  />
                ) : (
                  event.userId
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
