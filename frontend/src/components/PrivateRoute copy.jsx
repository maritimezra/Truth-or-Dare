import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoginModal from './LoginModal'; 

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');
  const [showLoginModal, setShowLoginModal] = useState(!token);

  useEffect(() => {
    if (!token) {
      setShowLoginModal(true);
    }
  }, [token]);

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return token ? <Component /> : <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} />;
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
