import PropTypes from 'prop-types';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const Header = ({ openProfileModal }) => {
  

  const handleProfileClick = () => {
    openProfileModal();
  };

  return (
    <header className="header">
      <h1>Truth or Dare</h1>
      <div className="user-info">
        <span onClick={handleProfileClick} className="profile-icon">
          <FontAwesomeIcon icon={faUser} />
        </span>
      </div>
    </header>
  );
};

Header.propTypes = {
    openProfileModal: PropTypes.func.isRequired,
  };

export default Header;
