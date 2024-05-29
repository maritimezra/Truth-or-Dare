import { useQuery, useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';

const ME = gql`
  query Me {
    me {
      username
      email
      gender
    }
  }
`;

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

const ProfileModal = ({ isOpen, onClose }) => {
  const { loading, error, data } = useQuery(ME);
  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      console.log("Successfully logged out")
    //window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isOpen) return null;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { username, email, gender } = data.me;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Profile Details</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Gender:</strong> {gender}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProfileModal;
