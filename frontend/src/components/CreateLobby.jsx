import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_LOBBY = gql`
  mutation CreateLobby($name: String!, $level: String!, $category: String!) {
    createLobby(name: $name, level: $level, category: $category) {
      createdAt
      name
      id
      level
      category
    }
  }
`;

const levels = ["ML", "MD", "WD"];
const categories = ["R", "T", "W", "F", "S", "P"];

const CreateLobby = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const [createLobby] = useMutation(CREATE_LOBBY);

  const handleCreateLobby = () => {
    createLobby({ variables: { name, level, category } })
      .then(result => {
        console.log('Lobby created:', result.data.createLobby);
        // Handle success or redirect to another page
      })
      .catch(error => {
        console.error('Error creating lobby:', error);
        // Handle error or show error message
      });
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
    </div>
  );
};

export default CreateLobby;
