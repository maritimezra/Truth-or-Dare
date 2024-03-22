import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const LOGIN_USER = gql`
  mutation MyMutation($email: String!, $password: String!) {
    login(emailInput: { email: $email }, passwordInput: { password: $password })
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = () => {
    loginUser({ variables: { email, password } })
      .then(result => {
        if (result.data.login) {
          // Login successful, redirect or perform necessary actions
          console.log('Login successful');
        } else {
          // Login failed, handle error or show error message
          console.error('Login failed');
        }
      })
      .catch(error => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <div>
      <h2>Login Form</h2>
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
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default Login;
