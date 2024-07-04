import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApolloClient, useMutation, gql } from '@apollo/client';

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const Logout = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [logout] = useMutation(LOGOUT);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        localStorage.removeItem('token');
        await client.resetStore();
        navigate('/login');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    handleLogout();
  }, [client, logout, navigate]);

  return null;
};

export default Logout;
