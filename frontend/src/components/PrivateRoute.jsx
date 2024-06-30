import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ element: Component }) => {
  const token = localStorage.getItem('token');

  return token ? <Component /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
