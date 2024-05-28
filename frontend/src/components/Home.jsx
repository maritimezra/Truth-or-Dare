import { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import LoginModal from './Login';

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

const GET_LOBBIES = gql`
  query GetLobbies {
    getLobbies {
      id
      name
      level
      category
    }
  }
`;

const GET_USERNAME = gql`
  query GetUsername {
    getUsername {
      username
    }
  }
`;


const levels = ["Mild", "Moderate", "Wild"];
const categories = ["Romance", "Travel", "Work", "Food", "Sex", "Parenting"];

const Home = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME);
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES);
  const [createLobby] = useMutation(CREATE_LOBBY);

  const handleCreateLobby = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    try {
      const { data } = await createLobby({
        variables: { name, level, category }
      });
      console.log('Lobby created:', data.createLobby);
      const lobbyId = data.createLobby.id;
      refetch(); // Refetch the list of lobbies after creating a new one
      navigate(`/lobbies/${lobbyId}`);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  if (loading || usernameLoading) return <p>Loading...</p>;
  if (error || usernameError) return <p>{error ? error.message : usernameError.message}</p>;


  const lobbies = data.getLobbies;
  const username = usernameData.getUsername.username;

  return (
    <div>
      <div>
        <div className="menubar">
          <div className="menubar-left">
            Truth or Dare
          </div>
          <div className="menubar-right">
            {username ? (
              <p>Hi, {username}</p>
            ):(
              <button onClick={() => setIsLoginModalOpen(true)}>Login</button>
            )}
          </div>
        </div>
      </div>
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

      <h2>Your Lobbies</h2>
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby.id}>
            <h3>{lobby.name}</h3>
            <p>Level: {lobby.level}</p>
            <p>Category: {lobby.category}</p>
          </li>
        ))}
      </ul>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default Home;
