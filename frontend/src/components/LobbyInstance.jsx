import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

const GET_LOBBY = gql`
  query GetLobby($lobbyId: Int!) {
    getLobby(lobbyId: $lobbyId) {
      id
      level
      category
      name
    }
  }
`;

const LobbyInstance = () => {
  const { lobbyId } = useParams();
  const { loading, error, data } = useQuery(GET_LOBBY, {
    variables: { lobbyId: parseInt(lobbyId) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const lobby = data.getLobby;

  return (
    <div>
      <h2>Lobby Details</h2>
      <p>Name: {lobby.name}</p>
      <p>Level: {lobby.level}</p>
      <p>Category: {lobby.category}</p>
    </div>
  );
};

export default LobbyInstance;
