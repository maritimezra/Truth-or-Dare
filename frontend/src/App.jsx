import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom'; 
import Home from './components/Home';
// import Signup from './components/Signup';
// import Login from './components/Login';

const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql/',
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <h1>Truth or Dare</h1>
          <Home />
          {/* <Signup />
          <Login /> */}
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
