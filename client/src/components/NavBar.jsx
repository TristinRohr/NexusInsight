import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';
import Search from './Search';  // Correctly import Search

const NavBar = ({ isLoggedIn, handleLogout, handleSearch, isHeader }) => {
    const location = useLocation();  // Get the current location

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link className="navbar-brand" to="/">Nexus Insight</Link>
                
                {/* Only show the Search bar if not on the LandingSearch page */}
                {location.pathname !== '/LandingSearch' && (
                    <Search onSearch={handleSearch} isHeader={isHeader} />
                )}
                
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