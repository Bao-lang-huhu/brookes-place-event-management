// src/components/GuestPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function GuestPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, [auth]);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate('/auth');
        }).catch((error) => {
            console.error('Sign out error', error);
        });
    };

    return (
        <div>
            <header>
                <nav>
                    <div className="logo">BROOKES PLACE</div>
                    <ul>
                        <li><Link to="/">HOME</Link></li>
                        {isLoggedIn ? (
                            <>
                                <li><Link to="/profile">PROFILE</Link></li>
                                <li><button onClick={handleSignOut}>SIGN OUT</button></li>
                            </>
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

export default GuestPage;