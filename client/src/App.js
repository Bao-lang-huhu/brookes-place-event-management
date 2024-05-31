import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthPage from './components/auth';
import EventList from './components/EventList';
import EventCreate from './components/EventCreate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/event-lists" element={<EventList />} />
      <Route path="/event-planner" element={<EventCreate />} />
    </Routes>
  );
}

export default App;
