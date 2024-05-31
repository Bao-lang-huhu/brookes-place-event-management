// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <header>
                <nav>
                    <div className="logo">BROOKES PLACE</div>
                    <ul>
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/event-lists">EVENT LISTS</Link></li>
                        <li><Link to="/event-planner">EVENT PLANNER</Link></li>
                        <li><Link to="/auth">SIGN IN</Link></li> {/* Ensure this path is correct */}
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
