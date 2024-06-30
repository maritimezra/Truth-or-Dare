import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const CREATE_USER = gql`
  mutation ($email: String!, $password: String!, $username: String!, $gender: String!) {
    createUser(email: $email, password: $password, username: $username, gender:$gender) {
      email
      username
      gender
      id
      dateJoined
    }
  }
`;

const genderOptions = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'N', label: 'Nonbinary' },
];

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); 
  const [gender, setGender] = useState(''); 

  const navigate = useNavigate();

  const [createUser] = useMutation(CREATE_USER);

  const handleSignup = () => {
    createUser({ variables: { email, password, username, gender } })
      .then(result => {
        console.log('User created:', result.data.createUser);
        navigate('/login');
      })
      .catch(error => {
        console.error('Error creating user:', error);
        // Handle error or show error message
      });
  };

  return (
    <div>
      <h2>Create Account</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text" 
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        {genderOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
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
