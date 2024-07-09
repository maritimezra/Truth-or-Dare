import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CreateLobbyModal from './CreateLobbyModal';
import LobbyInstanceModal from './LobbyInstanceModal';

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
  const location = useLocation();
  const [isCreateLobbyModalOpen, setCreateLobbyModalOpen] = useState(false);
  const [isLobbyInstanceModalOpen, setLobbyInstanceModalOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME, {
    fetchPolicy: 'network-only'
  });
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES, {
    fetchPolicy: 'network-only'
  });

  const handleCreateNew = () => {
    setCreateLobbyModalOpen(true);
  };

  const closeCreateLobbyModal = () => {
    setCreateLobbyModalOpen(false);
  };

  const handleLobbyClick = (lobbyId) => {
    setSelectedLobbyId(parseInt(lobbyId));
    setLobbyInstanceModalOpen(true);
  };

  const closeLobbyInstanceModal = () => {
    setLobbyInstanceModalOpen(false);
    setSelectedLobbyId(null);
  };

  const handleLobbyCreated = (lobbyId) => {
    setSelectedLobbyId(lobbyId);
    setLobbyInstanceModalOpen(true);
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
        <h2>Hi, {username}</h2>
      </div>
      <div>
        <h2>Your Lobbies</h2>
        <ul>
          {lobbies.map((lobby) => (
            <li key={lobby.id} onClick={() => handleLobbyClick(lobby.id)} style={{ cursor: 'pointer' }}>
              <h3>{lobby.name}</h3>
            </li>
          ))}
        </ul>
        <button onClick={handleCreateNew}>Create New</button>
      </div>
      <CreateLobbyModal
        isOpen={isCreateLobbyModalOpen}
        onClose={closeCreateLobbyModal}
        onLobbyCreated={handleLobbyCreated}
      />
      {selectedLobbyId && (
        <LobbyInstanceModal
          isOpen={isLobbyInstanceModalOpen}
          onClose={closeLobbyInstanceModal}
          lobbyId={selectedLobbyId ? parseInt(selectedLobbyId) : null}
        />
      )}
    </div>
  );
};

export default Home;
