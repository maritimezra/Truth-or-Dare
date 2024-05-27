import {useState}from 'react';
import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import LoginModal from './components/Login';
import Signup from './components/Signup';
import LobbyInstance from './components/LobbyInstance';
import Modal from 'react-modal'


Modal.setAppElement('#root');

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} /> }/>
            <Route path="/signup" element={<Signup />} />
            <Route path="/lobbies/:lobbyId" element={<LobbyInstance />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  )
};

export default App;