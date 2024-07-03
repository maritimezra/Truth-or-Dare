import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import couplesMildTruthQuestions from './questions/couples/mild/truth.json'
import couplesMildDareQuestions from './questions/couples/mild/dare.json'
import couplesModTruthQuestions from './questions/couples/moderate/truth.json'
import couplesModDareQuestions from './questions/couples/moderate/dare.json'
import couplesWildTruthQuestions from './questions/couples/wild/truth.json'
import couplesWildDareQuestions from './questions/couples/wild/dare.json'
import gamenightMildTruthQuestions from './questions/gamenight/mild/truth.json'
import gamenightMildDareQuestions from './questions/gamenight/mild/dare.json'
import gamenightModTruthQuestions from './questions/gamenight/moderate/truth.json'
import gamenightModDareQuestions from './questions/gamenight/moderate/dare.json'
import gamenightWildTruthQuestions from './questions/gamenight/wild/truth.json'
import gamenightWildDareQuestions from './questions/gamenight/wild/dare.json'
import teensMildTruthQuestions from './questions/teens/mild/truth.json'
import teensMildDareQuestions from './questions/teens/mild/dare.json'
import teensModTruthQuestions from './questions/teens/moderate/truth.json'
import teensModDareQuestions from './questions/teens/moderate/dare.json'
import teensWildTruthQuestions from './questions/teens/wild/truth.json'
import teensWildDareQuestions from './questions/teens/wild/dare.json'



const GET_LINEUP = gql`
  query GetLineup($lobbyId: Int!) {
    getLineup(lobbyId: $lobbyId)
  }
`;

const Tod = () => {
  const { lobbyId } = useParams();
  const { loading, error, data } = useQuery(GET_LINEUP, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  const [currentTurn, setCurrentTurn] = useState(0);
  const [players, setPlayers] = useState([]);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (data) {
      setPlayers(data.getLineup);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const fetchQuestion = (type) => {
    let category = 'Couples'; // Replace with your dynamic logic
    let level = 'Mild'; // Replace with your dynamic logic
    let questions;

    switch (category) {
      case 'Couples':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? couplesMildTruthQuestions.Questions : couplesMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? couplesModTruthQuestions.Questions : couplesModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? couplesWildTruthQuestions.Questions : couplesWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'GameNight':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? gamenightMildTruthQuestions.Questions : gamenightMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? gamenightModTruthQuestions.Questions : gamenightModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? gamenightWildTruthQuestions.Questions : gamenightWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      case 'Teens':
        switch (level) {
          case 'Mild':
            questions = type === 'truth' ? teensMildTruthQuestions.Questions : teensMildDareQuestions.Questions;
            break;
          case 'Moderate':
            questions = type === 'truth' ? teensModTruthQuestions.Questions : teensModDareQuestions.Questions;
            break;
          case 'Wild':
            questions = type === 'truth' ? teensWildTruthQuestions.Questions : teensWildDareQuestions.Questions;
            break;
          default:
            throw new Error('Invalid level');
        }
        break;
      default:
        throw new Error('Invalid category');
    }

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setQuestion(randomQuestion);
  };

  const handleNextTurn = () => {
    setCurrentTurn((prevTurn) => (prevTurn + 1) % players.length);
    setQuestion('');
  };

  const handleTruth = () => {
    fetchQuestion('truth');
  };

  const handleDare = () => {
    fetchQuestion('dare');
  };

  return (
    <div>
      <h1>Truth or Dare</h1>
      <h2>Current Turn: {players[currentTurn]}</h2>
      <button onClick={handleTruth}>Truth</button>
      <button onClick={handleDare}>Dare</button>
      {question && <p>{question}</p>}
      <button onClick={handleNextTurn}>Next Turn</button>
    </div>
  );
};

export default Tod;
