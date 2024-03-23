import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <div className="menubar">
        <div className="menubar-left">
          Truth or Dare
        </div>
        <div className="menubar-right">
          <Link to="/login">Login</Link> {/* Use Link component to navigate to '/login' */}
        </div>
      </div>
    </div>
  );
};

export default Home;
