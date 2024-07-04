import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileModal from './ProfileModal';

const GET_LOBBIES = gql`
  query GetLobbies {
    getLobbies {
      id
      name
      level
      category
    }
  }
`;

const GET_USERNAME = gql`
  query GetUsername {
    getUsername {
      username
    }
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME,{
    fetchPolicy: 'network-only'
  });
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES,{
    fetchPolicy: 'network-only'
  });

  const handleCreateNew = () => {
    navigate('/create-lobby');
  };

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [location.key, refetch]);

  if (loading || usernameLoading) return <p>Loading...</p>;
  if (error || usernameError) return <p>{error ? error.message : usernameError.message}</p>;

  const lobbies = data.getLobbies;
  const username = usernameData?.getUsername?.username;

  return (
    <div>
      <div>
        <h1>Play Truth or Dare</h1>
      </div>
      <div>
        <h2>Hi, {username}</h2>
      </div>
      <div>
        <h2>Your Lobbies</h2>
        <ul>
          {lobbies.map((lobby) => (
            <ul key={lobby.id} onClick={() => navigate(`/lobby-details?id=${lobby.id}`)} style={{ cursor: 'pointer' }}>

              <h3>{lobby.name}</h3>
            </ul>
          ))}
        </ul>
        <button onClick={handleCreateNew}>Create New</button>
        <button onClick={openProfileModal}>Profile</button>
      </div>

      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
};

export default Home;
