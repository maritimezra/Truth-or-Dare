// import React from 'react';
// import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
// import Home from './components/Home';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import CreateLobby from './components/CreateLobby';

// // Create an HTTP link with the GraphQL server URI
// const httpLink = createHttpLink({
//  uri: 'http://127.0.0.1:8000/graphql/',
// });

// // Use setContext to add the Authorization header to every request
// const authLink = setContext((_, { headers }) => {
//  // Get the authentication token from local storage if it exists
//  const token = localStorage.getItem('token');
//  // Return the headers to the context so HTTP link can read them
//  return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//  }
// });

// // Create the Apollo Client instance
// const client = new ApolloClient({
//  link: authLink.concat(httpLink), // Use the authLink and httpLink together
//  cache: new InMemoryCache(),
// });

// const App = () => {
//  return (
//     <ApolloProvider client={client}>
//       <Router>
//         <div>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/create-lobby" element={<CreateLobby />} />
//           </Routes>
//         </div>
//       </Router>
//     </ApolloProvider>
//  );
// };

// export default App;

import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import CreateLobby from './components/CreateLobby';


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
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  )
};

export default App;