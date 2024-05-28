import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_USERNAME = gql`
  query GetUsername {
    getUsername {
      username
    }
  }
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_USERNAME);

  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (data && data.getUsername) {
      setUsername(data.getUsername.username);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <p>Username not found.</p>
      )}
    </div>
  );
};

export default Profile;