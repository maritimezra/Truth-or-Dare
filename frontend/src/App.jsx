import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateLobby from './components/CreateLobby';
import LobbyInstance from './components/LobbyInstance';
import PrivateRoute from './components/PrivateRoute';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute element={Home} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-lobby" element={<PrivateRoute element={CreateLobby} />} />
          <Route path="/lobbies/:lobbyId" element={<PrivateRoute element={LobbyInstance} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
