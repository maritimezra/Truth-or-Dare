import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';
import ProfileModal from './ProfileModal';

const Layout = ({ children }) => {

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };
  return (
    <div className="layout">
      <Header openProfileModal={openProfileModal} />
      <main>{children}</main>
      <Footer />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
  };

export default Layout;
