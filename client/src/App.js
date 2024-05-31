// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AuthPage from './components/auth';
import EventList from './components/EventList';
import EventCreate from './components/EventCreate';
import GuestPage from './components/GuestPage';
import UserProfile from './components/UserProfile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<GuestPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/event-lists" element={<EventList />} />
            <Route path="/event-planner" element={<EventCreate />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin-home" element={<HomePage />} />
        </Routes>
    );
}

export default App;