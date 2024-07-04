# Truth or Dare Game

This is a web-based application for playing the classic party game "Truth or Dare." It allows users to create lobbies, add players, and play the game with a dynamic set of questions based on the chosen category and level. The application uses Django for the backend, GraphQL with Strawberry for the API, and React with Apollo Client for the frontend.

## Features

- **User Authentication and Authorization**
  - **JWT-based Authentication**: Secure login and signup functionality using JSON Web Tokens (JWT).

- **Lobby Management**
  - **Create Lobby**: Users can create a new lobby, specifying the category (Couples, Gamenight, Teens) and the level (Mild, Moderate, Wild) of the game.
  - **Rejoin Lobby**: Users can rejoin a lobby they previously created.
  - **Add Players**: Users can add players to the lobby by specifying their names or selecting from a list of previously added players.
  - **Edit/Remove Players**: Users can edit players' names or remove players from the lobby.

- **Game Play**
  - **Player Lineup**: A random player lineup is generated to define the order in which players will take turns.
  - **Truth or Dare Questions**: Players take turns choosing between "Truth" or "Dare" and are asked random questions from a large pool of questions.
  - **End Game**: The creator of the game has the option to end the game at any time.

## Technology Stack

- **Backend**
  - **Python (Django)**: Provides the core backend functionality, including user authentication, lobby management, and game logic.

- **API**
  - **GraphQL (Strawberry)**: Handles all data querying and mutations, offering a flexible and efficient API for the frontend to interact with.

- **Frontend**
  - **React**: Powers the user interface, ensuring a responsive and interactive user experience.
  - **Apollo Client**: Manages GraphQL queries and mutations, making it easy to interact with the backend API.
