# Multiplayer Tic Tac Toe Game (MERN + Socket.io)

This project is a real-time multiplayer Tic Tac Toe game built using the MERN stack (MongoDB, Express, React, Node.js) with Socket.io for seamless communication between players. The application includes user authentication, a profile picture feature, a lobby system, and real-time game rooms for a fully interactive gaming experience.

## Key Features

- **Authentication System**: Users are required to sign up and log in to access the game, ensuring that only authenticated users can participate in matches.
  
- **Profile Picture Support**: Users can upload and display profile pictures, adding a personal touch to their gaming profile.
  
- **Lobby System**: 
  - Users can see a list of all authenticated as well as online players.
  - Players can challenge any online/offline user to a game.
  - The challenged user has the option to either accept or reject the challenge.

- **Game Room**:
  - When a user accepts a challenge, both players enter a game room.
  - The game room is private, allowing only the two participating players to play the game.
  - Real-time updates are facilitated using Socket.io to ensure smooth gameplay.

## Corner Cases Handled

1. **Multiple Challenges**: 
   - Suppose if a player A challenge player B and C, B accepts the challenge of A. Now both the palyers A and B are in game room. At same time when these two players are in game room C wants to accepts the challenge of A. In this moment player C is unable to accepts challenge.

2. **Player Disconnection**: 
   - If a player goes offline during a game, the other player automatically exits the game room. For example, if player A goes offline while playing with player B, player B will be informed and automatically removed from the game room to avoid hanging sessions.

3. **Offline Challenges**: 
   - Users cannot accept challenges from offline users. This ensures that only active players can engage in a match.

4. **Game Room Access Control**: 
   - A game room is restricted to the two players engaged in a match, preventing any third party from entering.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **File Handling**: Multer (for profile picture uploads)
  
This project demonstrates real-time multiplayer functionality, handling various edge cases.