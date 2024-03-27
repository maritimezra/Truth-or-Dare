import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login')
    }

    return (
        <div>
            <div className="menubar">
                <div className="menubar-left">
                    <Link to="/">Truth or Dare</Link>
                </div>
                <div className="menubar-right">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
