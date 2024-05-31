// src/components/auth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import bcrypt from 'bcryptjs';

function AuthPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email,
                password: hashedPassword,
                uid: user.uid
            });

            setMessage('Registration successful! Redirecting to home page...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                setMessage('Email already in use.');
            } else {
                setMessage(`Registration failed: ${error.message}`);
            }
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setMessage('Login successful! Redirecting to home page...');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            setMessage(`Login failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>{isLogin ? 'Login' : 'Register'}</h2>
            {message && <p>{message}</p>}
            {isLogin ? (
                <form onSubmit={handleLogin}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => setIsLogin(false)}>Switch to Register</button>
                </form>
            ) : (
                <form onSubmit={handleRegister}>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />
                    <button type="submit">Register</button>
                    <button type="button" onClick={() => setIsLogin(true)}>Switch to Login</button>
                </form>
            )}
        </div>
    );
}

export default AuthPage;
