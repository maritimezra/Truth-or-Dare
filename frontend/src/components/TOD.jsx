import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_LINEUP = gql`
  query GetLineup($lobbyId: Int!) {
    getLineup(lobbyId: $lobbyId)
  }
`;

const TOD = () => {
  const { lobbyId } = useParams();
  const { loading, error, data } = useQuery(GET_LINEUP, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [currentTurn, setCurrentTurn] = useState(0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (data) {
      setPlayers(data.getLineup);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleNextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players.length);
  };

  return (
    <div>
      <h1>Truth or Dare</h1>
      <h2>Current Turn: {players[currentTurn]}</h2>
      <button>Truth</button>
      <button>Dare</button>
      <button onClick={handleNextTurn}>Next Turn</button>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default TOD;
