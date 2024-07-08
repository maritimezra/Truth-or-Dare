import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';


const CREATE_LOBBY = gql`
  mutation CreateLobby($name: String!, $level: String!, $category: String!) {
    createLobby(name: $name, level: $level, category: $category) {
      createdAt
      name
      id
      level
      category
      creator {
        id
        email
        username
      }
    }
  }
`;

const levels = ["Mild", "Moderate", "Wild"];
const categories = ["GameNight", "Couples", "Teens"]

const CreateLobby = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const [createLobby] = useMutation(CREATE_LOBBY);

  const handleCreateLobby = async () => {
    try {
      const { data } = await createLobby({
        variables: { name, level, category }
      });
      console.log('Lobby created:', data.createLobby);
      const lobbyId = data.createLobby.id;
      
      navigate(`/lobby-details/?id=${lobbyId}`);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  const handleBack = async () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Create Lobby</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select Level</option>
        {levels.map((level, index) => (
          <option key={index} value={level}>{level}</option>
        ))}
      </select>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
      <button onClick={handleCreateLobby}>Create Lobby</button>
      <button onClick={handleBack}>Back</button>
    </div>
  );
};


export default CreateLobby;
