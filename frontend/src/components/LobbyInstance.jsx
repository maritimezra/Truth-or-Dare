import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import Popup from 'reactjs-popup';

const ADD_PLAYER = gql`
  mutation AddPlayer($lobbyId: Int!, $playerName: String!) {
    addPlayer(lobbyId: $lobbyId, playerName: $playerName) {
      id
      name
    }
  }
`;

const GET_LOBBY = gql`
  query GetLobby($lobbyId: Int!) {
    getLobby(lobbyId: $lobbyId) {
      id
      level
      category
      name
    }
  }
`;

const LobbyInstance = () => {
  const { lobbyId } = useParams();
  const { loading, error, data } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_LOBBY, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const lobby = data.getLobby;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddPlayer = () => {
    addPlayer({
      variables: { lobbyId: parseInt(lobbyId), playerName: playerName },
    }).then(() => {
      setPlayerName(''); // Reset the input textbox to an empty string
    });
  };

  return (
    <div>
      <h2>{lobby.name}</h2>
      <p>Level: {lobby.level}</p>
      <p>Category: {lobby.category}</p>
      <button onClick={handleOpenModal}>Add Players</button>
      <Popup open={isModalOpen} closeOnDocumentClick={false}>
        <div>
          <h2>Players</h2>
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={handleAddPlayer}>Add Player</button>
          <button onClick={handleCloseModal}>Done</button>
        </div>
      </Popup>
    </div>
  );
};

export default LobbyInstance;
