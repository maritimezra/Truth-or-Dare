import PropTypes from 'prop-types';
import './Header.css';


const Header = ({ openProfileModal }) => {
  

  const handleProfileClick = () => {
    openProfileModal();
  };

  return (
    <header className="header">
      <h1>Truth or Dare</h1>
      <div className="user-info">
        <button onClick={handleProfileClick}>Profile</button>
      </div>
    </header>
  );
};

Header.propTypes = {
    openProfileModal: PropTypes.func.isRequired,
  };

export default Header;
