import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import CreateLobby from './CreateLobby';
import LobbyDetails from './LobbyDetails';
import './Home.css'

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
  const [isCreateLobbyOpen, setCreateLobbyOpen] = useState(false);
  const [isLobbyDetailsOpen, setLobbyDetailsOpen] = useState(false);
  const [selectedLobbyId, setSelectedLobbyId] = useState(null);

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME, {
    fetchPolicy: 'network-only'
  });
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES, {
    fetchPolicy: 'network-only'
  });

  const handleCreateNew = () => {
    setCreateLobbyOpen(true);
  };

  const closeCreateLobby = () => {
    setCreateLobbyOpen(false);
  };

  const handleLobbyClick = (lobbyId) => {
    setSelectedLobbyId(parseInt(lobbyId));
    setLobbyDetailsOpen(true);
  };

  const closeLobbyDetails = () => {
    setLobbyDetailsOpen(false);
    setSelectedLobbyId(null);
  };

  const handleLobbyCreated = (lobbyId) => {
    setSelectedLobbyId(lobbyId);
    setLobbyDetailsOpen(true);
  };

  useEffect(() => {
    refetch();
  }, [location.key, refetch]);

  if (loading || usernameLoading) return <p>Loading...</p>;
  if (error || usernameError) return <p>{error ? error.message : usernameError.message}</p>;

  const lobbies = data.getLobbies;
  const username = usernameData?.getUsername?.username;


  return (
    <div className="home">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="username">
        <h2><span class="scribble-underline">Hi, {username}</span></h2>
      </div>
      <div className="lobbies">
        <h2>Your Lobbies</h2>
        <div className="lobbylist">
        <ul>
          {lobbies.map((lobby) => (
            <ul key={lobby.id} onClick={() => handleLobbyClick(lobby.id)} style={{ cursor: 'pointer' }}>
              <h3>{lobby.name}</h3>
            </ul>
          ))}
        </ul>
        </div>
        <div className="createnew">
         <button onClick={handleCreateNew}>Create New</button>
        </div>
      </div>
      <CreateLobby
        isOpen={isCreateLobbyOpen}
        onClose={closeCreateLobby}
        onLobbyCreated={handleLobbyCreated}
      />
      {selectedLobbyId && (
        <LobbyDetails
          isOpen={isLobbyDetailsOpen}
          onClose={closeLobbyDetails}
          lobbyId={selectedLobbyId ? parseInt(selectedLobbyId) : null}
        />
      )}
    </div>
  );
};

export default Home;
