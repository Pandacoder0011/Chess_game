# ♟️ Real-Time Multiplayer Chess Game

A modern, real-time multiplayer chess application built with Node.js, Express, and Socket.IO. Play chess with friends online, watch ongoing games as a spectator, and enjoy a smooth, interactive gaming experience.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

- 🎮 **Real-Time Multiplayer Gameplay** - Play chess with friends in real-time using WebSocket technology
- 👁️ **Spectator Mode** - Watch ongoing games as a spectator (up to 2 players + unlimited spectators)
- 🖱️ **Drag-and-Drop Interface** - Intuitive piece movement with drag-and-drop functionality
- 📜 **Move History** - Track all moves made during the game
- ⚠️ **Game State Detection** - Automatic detection of check, checkmate, and draw conditions
- 🎨 **Modern UI** - Clean, responsive design with visual feedback
- 🔄 **Board Rotation** - Board automatically flips for black player for better gameplay experience
- ✅ **Move Validation** - Server-side validation ensures fair play
- 🚫 **Turn Management** - Prevents players from moving out of turn

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pandacode0011/Chess_game.git
   cd Chess_game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

The first two connections will be assigned as **White** and **Black** players. Additional connections will join as **Spectators**.

## 📋 Project Structure

```
Chess_game/
├── app.js                 # Main server file (Express + Socket.IO)
├── package.json           # Project dependencies and scripts
├── Procfile              # Heroku/Railway deployment configuration
├── render.yaml           # Render.com deployment configuration
├── fly.toml              # Fly.io deployment configuration
├── .gitignore            # Git ignore rules
├── public/
│   ├── script.js         # Client-side JavaScript (game logic)
│   └── styles.css        # Styling and UI components
└── views/
    └── index.ejs         # Main HTML template
```

## 🛠️ Technologies Used

- **Backend:**
  - [Node.js](https://nodejs.org/) - JavaScript runtime environment
  - [Express.js](https://expressjs.com/) - Web application framework
  - [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
  - [Chess.js](https://github.com/jhlywa/chess.js) - Chess game logic and move validation

- **Frontend:**
  - Vanilla JavaScript - Client-side game logic
  - HTML5 Drag and Drop API - Piece movement
  - CSS3 - Styling and animations
  - EJS - Template engine

## 🎯 How It Works

1. **Connection:** Players connect to the server via WebSocket
2. **Role Assignment:** First connection = White, Second = Black, Others = Spectators
3. **Game State:** Server maintains the chess board state using Chess.js
4. **Move Validation:** All moves are validated server-side before execution
5. **Real-Time Updates:** All connected clients receive instant updates via Socket.IO
6. **Game Rules:** Full chess rules including castling, en passant, and pawn promotion

## 🌐 Deployment

This application can be deployed on various platforms that support WebSocket connections:

### Recommended Platforms

#### 1. **Render** (Recommended - Free Tier)
- ✅ Full WebSocket support
- ✅ Free tier: 750 hours/month
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificates

**Deployment Steps:**
1. Push your code to GitHub
2. Go to [render.com](https://render.com)
3. Create a new "Web Service"
4. Connect your GitHub repository
5. Render will auto-detect settings from `render.yaml`
6. Deploy!

#### 2. **Railway**
- ✅ Excellent WebSocket support
- ✅ $5 free credit monthly
- ✅ One-click GitHub deployment

**Deployment Steps:**
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub"
4. Select your repository
5. Railway auto-detects and deploys!

#### 3. **Fly.io**
- ✅ Excellent WebSocket support
- ✅ Free tier available
- ✅ Global edge network

**Deployment Steps:**
1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch`
3. Follow the prompts
4. Deploy: `fly deploy`

#### 4. **Heroku**
- ✅ Good WebSocket support
- ⚠️ Paid plans only (no free tier)

**Deployment Steps:**
1. Install Heroku CLI
2. Run: `heroku create your-app-name`
3. Run: `git push heroku main`

### Environment Variables

The application uses the `PORT` environment variable (defaults to 3000):
```bash
PORT=3000
```

## 🎮 Game Features

### Player Roles
- **White Player:** Moves first, controls white pieces
- **Black Player:** Moves second, controls black pieces
- **Spectator:** Can watch the game but cannot make moves or reset the game

### Game States
- **Active Game:** Normal gameplay
- **Check:** Warning when king is in check
- **Checkmate:** Game over, winner declared
- **Draw:** Game ends in a draw

### Visual Feedback
- Valid move highlighting when dragging pieces
- Turn indicators showing whose turn it is
- Color-coded status messages
- Move history display

## 🔧 Configuration

### Server Configuration
- Default port: `3000`
- Can be changed via `PORT` environment variable
- Supports multiple concurrent games (one game per server instance)

### Client Configuration
- Auto-reconnects on connection loss
- Board automatically flips for black player
- Responsive design for different screen sizes

## 📝 API/Events

### Client → Server
- `move` - Send a move from client to server
- `reset_game` - Reset the game (players only)
- `request_board_state` - Request current board state

### Server → Client
- `playerrole` - Assign player role (white/black)
- `spectatorRole` - Assign spectator role
- `boardstate` - Send current board state (FEN notation)
- `move_made` - Broadcast move to all clients
- `invalid_move` - Notify client of invalid move

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Pandacode0011**

- GitHub: [@Pandacode0011](https://github.com/Pandacode0011)
- Repository: [Chess_game](https://github.com/Pandacode0011/Chess_game)

## 🙏 Acknowledgments

- [Chess.js](https://github.com/jhlywa/chess.js) - Chess game logic library
- [Socket.IO](https://socket.io/) - Real-time communication library
- [Express.js](https://expressjs.com/) - Web framework

## 📞 Support

If you have any questions or issues, please open an issue on the [GitHub repository](https://github.com/Pandacode0011/Chess_game/issues).

---

⭐ If you like this project, please give it a star on GitHub!
