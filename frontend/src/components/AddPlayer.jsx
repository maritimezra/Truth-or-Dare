import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import PropTypes from 'prop-types';
import './AddPlayer.css';

const ADD_PLAYER = gql`
  mutation AddPlayer($lobbyId: Int!, $playerName: String!) {
    addPlayer(lobbyId: $lobbyId, playerName: $playerName) {
      id
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

const AddPlayer = ({ lobbyId, onClose }) => {
  const [playerName, setPlayerName] = useState('');
  const [addPlayer] = useMutation(ADD_PLAYER, {
    refetchQueries: [{ query: GET_PLAYERS, variables: { lobbyId: parseInt(lobbyId) } }],
  });

  const handleAddPlayer = () => {
    if (playerName.trim() === '') {
      alert('Player name cannot be empty');
      return;
    }
    addPlayer({
      variables: { lobbyId: parseInt(lobbyId), playerName: playerName },
    }).then(() => {
      setPlayerName('');
      onClose();
    });
  };

  return (
    <div className="add-player-modal">
      <h2>Add Player</h2>
      <input
        type="text"
        placeholder="Player Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={handleAddPlayer}>Add Player</button>
      <button onClick={onClose}>Done</button>
    </div>
  );
};

AddPlayer.propTypes = {
  lobbyId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddPlayer;
