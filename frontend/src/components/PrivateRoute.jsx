import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Login from './Login'; 

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');
  const [showLogin, setShowLogin] = useState(!token);

  useEffect(() => {
    if (!token) {
      setShowLogin(true);
    }
  }, [token]);

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  return token ? <Component /> : <Login isOpen={showLogin} onClose={handleCloseLogin} />;
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
