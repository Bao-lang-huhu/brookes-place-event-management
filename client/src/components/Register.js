import React, { useState } from 'react';
import { auth } from '../path/to/firebase'; // Adjust this path to where your Firebase config file is

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log('User registered:', userCredential);
            // Redirect or perform additional actions
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Register</button>
        </form>
    );
}

export default Register;
