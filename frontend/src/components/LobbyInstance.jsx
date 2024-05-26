import { useState, useEffect } from 'react';
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

const EDIT_PLAYER = gql`
  mutation EditPlayer($playerId: Int!, $newName: String!) {
    editPlayer(playerId: $playerId, newName: $newName) {
      id
      name
    }
  }
`;

const REMOVE_PLAYER = gql`
  mutation RemovePlayer($playerId: Int!) {
    removePlayer(playerId: $playerId) {
      id
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

const GET_PLAYERS = gql`
  query GetPlayers($lobbyId: Int!) {
    getPlayers(lobbyId: $lobbyId) {
      id
      name
    }
  }
`;

const GET_CREATOR = gql`
  query GetCreator($lobbyId: Int!) {
    getCreator(lobbyId: $lobbyId) {
      username
    }
  }
`;

const LobbyInstance = () => {
  const { lobbyId } = useParams();
  const { loading: loadingLobby, error: errorLobby, data: dataLobby } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const { loading: loadingPlayers, error: errorPlayers, data: dataPlayers } = useQuery(GET_PLAYERS, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const { loading: loadingCreator, error: errorCreator, data: dataCreator } = useQuery(GET_CREATOR, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');

  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  const [editPlayer] = useMutation(EDIT_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  const [removePlayer] = useMutation(REMOVE_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  useEffect(() => {
    if (dataPlayers) {
      setPlayers(dataPlayers.getPlayers);
    }
  }, [dataPlayers]);

  useEffect(() => {
    if (dataCreator && isModalOpen) {
      const creatorName = dataCreator.getCreator.username;
      if (!players.some(player => player.name === creatorName)) {
        setPlayers(prevPlayers => [...prevPlayers, { id: 'creator', name: creatorName }]);
      }
    }
  }, [dataCreator, isModalOpen, players]);

  if (loadingLobby || loadingPlayers || loadingCreator) return <p>Loading...</p>;
  if (errorLobby) return <p>Error: {errorLobby.message}</p>;
  if (errorPlayers) return <p>Error: {errorPlayers.message}</p>;
  if (errorCreator) return <p>Error: {errorCreator.message}</p>;

  const lobby = dataLobby.getLobby;

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

  const handleEditPlayer = (playerId) => {
    editPlayer({
      variables: { playerId: playerId, newName: newPlayerName },
    }).then(() => {
      setEditingPlayerId(null);
      setNewPlayerName('');
    });
  };

  const handleRemovePlayer = (playerId) => {
    removePlayer({
      variables: { playerId: playerId },
    });
  };

  return (
    <div>
      <h2>{lobby.name}</h2>
      <p>Level: {lobby.level}</p>
      <p>Category: {lobby.category}</p>
      <button onClick={handleOpenModal}>Add Players</button>
      <Popup open={isModalOpen} closeOnDocumentClick={false} onClose={handleCloseModal}>
        <div>
          <h2>Add Player</h2>
          <input
            type="text"
            placeholder="Player Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={handleAddPlayer}>Add Player</button>
          <button onClick={handleCloseModal}>Done</button>
          <h3>Players</h3>
          <ul>
            {players.map((player) => (
              <div key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
                {editingPlayerId === player.id ? (
                  <>
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                    />
                    <button onClick={() => handleEditPlayer(player.id)}>Save</button>
                    <button onClick={() => setEditingPlayerId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>{player.name}</span>
                    <select onChange={(e) => {
                      if (e.target.value === 'edit') {
                        setEditingPlayerId(player.id);
                        setNewPlayerName(player.name);
                      } else if (e.target.value === 'remove') {
                        handleRemovePlayer(player.id);
                      }
                      e.target.value = '';
                    }}>
                      <option value="">Actions</option>
                      <option value="edit">Edit</option>
                      <option value="remove">Remove</option>
                    </select>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      </Popup>
    </div>
  );
};

export default LobbyInstance;
