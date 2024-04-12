// import React, { useState, useEffect } from 'react';
// import { useMutation, gql } from '@apollo/client';

// const CREATE_LOBBY = gql`
//   mutation CreateLobby($name: String!, $level: String!, $category: String!) {
//     createLobby(name: $name, level: $level, category: $category) {
//       createdAt
//       name
//       id
//       level
//       category
//     }
//   }
// `;

// const levels = ["ML", "MD", "WD"];
// const categories = ["R", "T", "W", "F", "S", "P"];

// const CreateLobby = () => {
//   const [name, setName] = useState('');
//   const [level, setLevel] = useState('');
//   const [category, setCategory] = useState('');

//   const [createLobby] = useMutation(CREATE_LOBBY);

//   // Use useEffect to retrieve the authentication token from local storage
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       // Handle the case where the token is not available
//       console.error('User is not authenticated'); // Log an error for debugging
//     }
//   }, []);

//   const handleCreateLobby = () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       createLobby({
//         variables: { name, level, category },
//         context: {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       })
//         .then(result => {
//           console.log('Lobby created:', result.data.createLobby);
//           // Handle success or redirect to another page
//         })
//         .catch(error => {
//           console.error('Error creating lobby:', error);
//           // Handle error or show error message
//         });
//     } else {
//       console.error('User is not authenticated'); // Log an error for debugging
//     }
//   };

//   return (
//     <div>
//       <h2>Create Lobby</h2>
//       {/* Input fields and select dropdowns */}
//       <input
//         type="text"
//         placeholder="Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       {/* Select dropdown for level */}
//       <select value={level} onChange={(e) => setLevel(e.target.value)}>
//         <option value="">Select Level</option>
//         {levels.map((level, index) => (
//           <option key={index} value={level}>{level}</option>
//         ))}
//       </select>
//       {/* Select dropdown for category */}
//       <select value={category} onChange={(e) => setCategory(e.target.value)}>
//         <option value="">Select Category</option>
//         {categories.map((category, index) => (
//           <option key={index} value={category}>{category}</option>
//         ))}
//       </select>
//       {/* Button to create a lobby */}
//       <button onClick={handleCreateLobby}>Create Lobby</button>
//     </div>
//   );
// };

// export default CreateLobby;

import React, { useState, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';

const CREATE_LOBBY = gql`
  mutation CreateLobby($name: String!, $level: String!, $category: String!) {
    createLobby(name: $name, level: $level, category: $category) {
      createdAt
      name
      id
      level
      category
    }
  }
`;

const levels = ["ML", "MD", "WD"];
const categories = ["R", "T", "W", "F", "S", "P"];

const CreateLobby = () => {
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');

  const [createLobby] = useMutation(CREATE_LOBBY);

  // Use useEffect to retrieve the authentication token from local storage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Handle the case where the token is not available
      console.error('User is not authenticated'); // Log an error for debugging
    }
  }, []);

  const handleCreateLobby = () => {
    const token = localStorage.getItem('token');
    if (token) {
      createLobby({
        variables: { name, level, category },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
        .then(result => {
          console.log('Lobby created:', result.data.createLobby);
          // Handle success or redirect to another page
        })
        .catch(error => {
          console.error('Error creating lobby:', error);
          // Handle error or show error message
        });
    } else {
      console.error('User is not authenticated'); // Log an error for debugging
    }
  };

  return (
    <div>
      <h2>Create Lobby</h2>
      {/* Input fields and select dropdowns */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Select dropdown for level */}
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option value="">Select Level</option>
        {levels.map((level, index) => (
          <option key={index} value={level}>{level}</option>
        ))}
      </select>
      {/* Select dropdown for category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>{category}</option>
        ))}
      </select>
      {/* Button to create a lobby */}
      <button onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
};

export default CreateLobby;
