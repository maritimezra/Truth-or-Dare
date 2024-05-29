import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import LoginModal from './Login';
import CreateLobby from './CreateLobby';
import ProfileModal from './ProfileModal';


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

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { loading: usernameLoading, error: usernameError, data: usernameData } = useQuery(GET_USERNAME);
  const { loading, error, data, refetch } = useQuery(GET_LOBBIES);

  if (loading || usernameLoading) return <p>Loading...</p>;
  if (error || usernameError) return <p>{error ? error.message : usernameError.message}</p>;

  const lobbies = data.getLobbies;
  const username = usernameData?.getUsername?.username;

  return (
    <div>
      <div>
        <div className="menubar">
          <div className="menubar-left">
            Truth or Dare
          </div>
          <div className="menubar-right">
            {username ? (
              <>
              <p>Hi, {username}</p>
              <button onClick={() => setIsProfileModalOpen(true)}>Profile</button>
              </>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)}>Login</button>
            )}
          </div>
        </div>
      </div>
      <div>
      <CreateLobby refetchLobbies={refetch} />
      </div>
      
      <div>
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
      </div>
      

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default Home;
