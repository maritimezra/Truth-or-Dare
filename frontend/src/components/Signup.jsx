import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation ($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      email
      id
      dateJoined
      isActive
      isStaff
    }
  }
`;

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [createUser] = useMutation(CREATE_USER);

  const handleSignup = () => {
    createUser({ variables: { email, password } })
      .then(result => {
        console.log('User created:', result.data.createUser);
        // Handle success or update UI as needed
      })
      .catch(error => {
        console.error('Error creating user:', error);
        // Handle error or show error message
      });
  };

  return (
    <div>
      <h2>Signup Form</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
