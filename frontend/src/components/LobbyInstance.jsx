import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  const { lobbyId } = useParams();
  const client = useApolloClient();

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
      setPlayerName(''); // Reset the input textbox to an empty string
    });
  };

  const handleEditPlayer = () => {
    editPlayer({
      variables: { playerId: parseInt(selectedPlayerId), newName: newPlayerName },
    }).then(() => {
      setEditingPlayerId(null);
      setNewPlayerName('');
      setSelectedPlayerId(null);
    });
  };

  const handleRemovePlayer = async () => {
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
  
  

  return (
    <div>
      <h2>{lobby.name}</h2>
      <p>Level: {lobby.level}</p>
      <p>Category: {lobby.category}</p>
      <button onClick={handleOpenModal}>Add Players</button>
      <h3>Players</h3>
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
              <>
                <span>{player.name}</span>
                <select
                  onChange={(e) => {
                    if (e.target.value === 'edit') {
                      setEditingPlayerId(player.id);
                      setNewPlayerName(player.name);
                    } else if (e.target.value === 'remove') {
                      setSelectedPlayerId(player.id);
                      handleRemovePlayer();
                    }
                    e.target.value = '';
                  }}
                >
                  <option value="">Actions</option>
                  <option value="edit">Edit</option>
                  <option value="remove">Remove</option>
                </select>
              </>
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
    </div>
  );
};

export default LobbyInstance;
