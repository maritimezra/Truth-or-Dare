import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
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
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleCreateNew = () => {
    navigate('/create-lobby');
  };

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME);
  // eslint-disable-next-line no-unused-vars
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES);

  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

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
      {/* <CreateLobby refetchLobbies={refetch} /> */}
      </div>
      <div>
        <h2>Your Lobbies</h2>
        <ul>
          {lobbies.map((lobby) => (
            <li key={lobby.id}>
              <h3>{lobby.name}</h3>
              <p>Level: {lobby.level}</p>
              <p>Category: {lobby.category}</p>
            </li>
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
