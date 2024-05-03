// import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateLobby from './components/CreateLobby';
// import LobbyInstance from './components/LobbyInstance';


const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/',
  cache: new InMemoryCache()
});
const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-lobby" element={<CreateLobby />} />
            {/* <Route path="/lobbies/:lobbyId" element={<LobbyInstance />} /> */}
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  )
};

export default App;