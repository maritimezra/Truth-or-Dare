import React, { useState, useEffect } from 'react';
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
      creator{
        username
      }
    }
  }
`;

const levels = ["Mild", "Moderate", "Wild"];
const categories = ["Romance", "Travel", "Work", "Food", "Sex", "Parenting"];

const CreateLobby = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const [createLobby] = useMutation(CREATE_LOBBY);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('User is not authenticated'); 
    }
  }, []);

  const handleCreateLobby = () => {
    const token = localStorage.getItem('token');
    if (token) {
      createLobby({
        variables: { name, level, category },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
        .then(result => {
          console.log('Lobby created:', result.data.createLobby);
          const lobbyId = result.data.createLobby.id;
          // navigate(`/lobbies/${lobbyId}`);
        })
        .catch(error => {
          console.error('Error creating lobby:', error);
        });
    } else {
      console.error('User is not authenticated'); 
    }
  };

  return (
    <div>
      <h2>Create Lobby</h2>
      {/* Input fields and select dropdowns */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Select dropdown for level */}
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select Level</option>
        {levels.map((level, index) => (
          <option key={index} value={level}>{level}</option>
        ))}
      </select>
      {/* Select dropdown for category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
      {/* Button to create a lobby */}
      <button onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
};

export default CreateLobby;
