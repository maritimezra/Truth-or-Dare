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
  // Use useQuery hook to execute the GraphQL query
  const { loading, error, data } = useQuery(GET_USERNAME);

  // State to store the username
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Update the username state when data is fetched
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