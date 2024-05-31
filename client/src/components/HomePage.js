// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function HomePage() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/auth');
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="logo">BROOKES PLACE</div>
                    <ul>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/event-lists">EVENT LISTS</Link></li>
                        <li><Link to="/event-planner">EVENT PLANNER</Link></li>
                        {user ? (
                            <li><button onClick={handleSignOut}>SIGN OUT</button></li>
                        ) : (
                            <li><Link to="/auth">SIGN IN</Link></li>
                        )}
                    </ul>
                </nav>
            </header>
            <main>
                <section className="hero">
                    <h1>EVENTS WITH EXCELLENCE</h1>
                    <p>Create magnificent memories with Brookes Place parties and events</p>
                    <div className="social-media">
                        <a href="#facebook"><img src="facebook-icon.png" alt="Facebook" /></a>
                        <a href="#instagram"><img src="instagram-icon.png" alt="Instagram" /></a>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default HomePage;
