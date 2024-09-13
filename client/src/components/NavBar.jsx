import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import './Search';
import Search from './Search';

const NavBar = ({ isLoggedIn, handleLogout }) => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/">League of Legends Tracker</Link>
                {/* <Search /> */}
                <div className="navbar-nav-container">
                    <ul className="navbar-nav">
                        {isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/match-history">Match History</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/favorite-feed">Favorite Feed</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;