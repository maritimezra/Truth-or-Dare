import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';


const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      token
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [loginUser] = useMutation(LOGIN_USER);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data } = await loginUser({ variables: { email, password } });
      if (data && data.login && data.login.success) {
        console.log('Login successful');
        console.log('Token:', data.login.token);
        localStorage.setItem('token', data.login.token);
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Dont have an account? <Link to="/signup">Create account</Link>
      </p>
    </div>
  );
};

export default Login;
