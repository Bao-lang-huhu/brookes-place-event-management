import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

function UserProfile() {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("User UID:", user.uid); // Debugging: Log the user UID
        fetchUserId(user.uid);
      } else {
        console.log("No user logged in");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchUserId = (uid) => {
    const userRef = ref(database, `users/${uid}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      console.log("User data from Firebase:", userData); // Debugging: Log user data
      if (userData) {
        setUserId(userData.userId);
        fetchUserEvents(userData.userId);
      } else {
        console.log("No user data found for UID:", uid);
      }
    }, (error) => {
      console.error("Error fetching user data:", error); // Debugging: Log any errors
    });
  };

  const fetchUserEvents = (userId) => {
    const eventsRef = ref(database, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Raw event data from Firebase:", data); // Debugging: Log raw event data
      if (data) {
        const userEvents = Object.entries(data)
          .filter(([id, event]) => event.userId === userId)
          .map(([id, event]) => ({ id, ...event }));
        
        console.log("Filtered user events:", userEvents); // Debugging: Log filtered events
        setEvents(userEvents);
      } else {
        console.log("No events found in the database.");
      }
    }, (error) => {
      console.error("Error fetching data:", error); // Debugging: Log any errors
    });
  };

  return (
    <div>
      <h2>User Profile</h2>
      <h3>Reserved Events</h3>
      {events.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Username</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.customerName}</td>
                <td>{event.username}</td>
                <td>{event.date}</td>
                <td>{event.time}</td>
                <td>{event.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No events reserved.</p>
      )}
    </div>
  );
}

export default UserProfile;
