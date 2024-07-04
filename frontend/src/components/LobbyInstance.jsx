import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
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
  mutation RemovePlayer($lobbyId: Int!, $playerId: Int!) {
    removePlayer(lobbyId: $lobbyId, playerId: $playerId)
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

const GET_LOBBYID = gql`
  query GetLobbyId($playerId: Int!) {
    getLobbyid(playerId: $playerId)
  }
`;

const LobbyInstance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  const searchParams = new URLSearchParams(location.search);
  const lobbyId = searchParams.get('id');

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
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);

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
    if (dataPlayers && dataCreator) {
      const creatorName = dataCreator.getCreator.username;
      const updatedPlayers = [...dataPlayers.getPlayers];
      if (!updatedPlayers.some(player => player.name === creatorName)) {
        updatedPlayers.push({ id: 'creator', name: creatorName });
      }
      setPlayers(updatedPlayers);
    }
  }, [dataPlayers, dataCreator]);

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
      setPlayerName('');
    });
  };

  const handleEditPlayer = () => {
    if (!editingPlayerId || !newPlayerName.trim()) return;

    editPlayer({
      variables: { playerId: parseInt(editingPlayerId), newName: newPlayerName },
    }).then(() => {
      setEditingPlayerId(null);
      setNewPlayerName('');
    });
  };

  const handleRemovePlayer = async () => {
    if (!selectedPlayerId) return;

    try {
      const { data } = await client.query({
        query: GET_LOBBYID,
        variables: { playerId: parseInt(selectedPlayerId) },
      });

      if (data.getLobbyid === parseInt(lobbyId)) {
        removePlayer({
          variables: { lobbyId: parseInt(lobbyId), playerId: parseInt(selectedPlayerId) },
        }).then(() => {
          setSelectedPlayerId(null);
        });
      } else {
        alert("Player does not belong to this lobby.");
      }
    } catch (error) {
      console.error('Error removing player:', error);
    }
  };

  const handleActionChange = (event) => {
    const action = event.target.value;
    if (action === 'edit') {
      const player = players.find(player => player.id === selectedPlayerId);
      if (player) {
        setEditingPlayerId(player.id);
        setNewPlayerName(player.name);
      }
    } else if (action === 'remove') {
      handleRemovePlayer();
    }
  };

  const handleHome = async () => {
    navigate('/')
  };

  const handleStartGame = async () => {
    navigate(`/play-game?id=${lobbyId}`);
  };

  return (
    <div>
      <h2>{lobby.name}</h2>
      <p>Level: {lobby.level}</p>
      <p>Category: {lobby.category}</p>
      <h3>Players</h3>
      <div style={{ marginBottom: '10px' }}>
        <select value="" onChange={handleActionChange}>
          <option value="">Action...</option>
          <option value="edit">Edit</option>
          <option value="remove">Remove</option>
        </select>
      </div>
      <ul>
        {players.map((player) => (
          <div key={player.id} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedPlayerId === player.id}
              onChange={() => setSelectedPlayerId(player.id)}
            />
            {editingPlayerId === player.id ? (
              <>
                <input
                  type="text"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <button onClick={handleEditPlayer}>Save</button>
                <button onClick={() => setEditingPlayerId(null)}>Cancel</button>
              </>
            ) : (
              <span>{player.name}</span>
            )}
          </div>
        ))}
      </ul>
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
        </div>
      </Popup>
      <button onClick={handleOpenModal}>Add Players</button>
      <button onClick={handleHome}>Home</button>
      <button onClick={handleStartGame}>Start Game</button>
    </div>
  );
};

export default LobbyInstance;
