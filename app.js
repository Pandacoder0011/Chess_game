const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const { Chess } = require("chess.js");
const path = require('path');
const { title } = require('process');

const chess = new Chess();

let players = {};
let currentPlayer = "W";

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', {title: "Custom Chess Game"});
});

// Socket.IO connection handling
io.on('connection', (uniquesocket) => {
    console.log('A user connected');

    if(!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerrole", "white");
        uniquesocket.emit("boardstate", chess.fen());
        console.log('White player connected:', uniquesocket.id); // Debug log
    } else if(!players.black) {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerrole", "black");
        uniquesocket.emit("boardstate", chess.fen());
        console.log('Black player connected:', uniquesocket.id); // Debug log
    } else {
        uniquesocket.emit("spectatorRole", "spectator");
        uniquesocket.emit("boardstate", chess.fen());
        console.log('Spectator connected:', uniquesocket.id); // Debug log
        return;
    }

    // Update move handling
    uniquesocket.on("move", (move) => {
        try {
            console.log('Received move event:', { from: move.from, to: move.to, socketId: uniquesocket.id });
            
            const currentTurn = chess.turn();
            const playerColor = uniquesocket.id === players.white ? 'w' : 'b';
            
            // Log move attempt for debugging
            console.log('Move attempt:', {
                from: move.from,
                to: move.to,
                playerColor,
                currentTurn,
                playerIsWhite: uniquesocket.id === players.white,
                playerIsBlack: uniquesocket.id === players.black
            });

            // Validate turn
            if ((currentTurn === 'w' && uniquesocket.id !== players.white) ||
                (currentTurn === 'b' && uniquesocket.id !== players.black)) {
                console.log('Turn validation failed');
                uniquesocket.emit("invalid_move", "Not your turn");
                return;
            }

            // Get the piece at source square
            const piece = chess.get(move.from);
            
            // Validate piece ownership
            if (!piece) {
                console.log('No piece at source square');
                uniquesocket.emit("invalid_move", "No piece at source square");
                return;
            }
            
            if (piece.color !== playerColor) {
                console.log('Not your piece');
                uniquesocket.emit("invalid_move", "Not your piece");
                return;
            }

            // Make the move
            const moveResult = chess.move({
                from: move.from,
                to: move.to,
                promotion: 'q'
            });

            if (moveResult) {
                // Broadcast successful move to all clients
                io.emit("move_made", {
                    from: move.from,
                    to: move.to,
                    fen: chess.fen(),
                    turn: chess.turn()
                });
                
                console.log('Move successful:', {
                    from: move.from,
                    to: move.to,
                    piece: piece.type,
                    color: piece.color,
                    newPosition: chess.fen(),
                    newTurn: chess.turn()
                });
            } else {
                console.log('Invalid move result from chess.js');
                uniquesocket.emit("invalid_move", "Invalid move");
                console.log('Invalid move:', {
                    from: move.from,
                    to: move.to,
                    piece: piece.type,
                    color: piece.color
                });
            }
        } catch (err) {
            console.error('Move error:', err);
            uniquesocket.emit("invalid_move", err.message);
            // Resync board state
            uniquesocket.emit("boardstate", chess.fen());
        }
    });

    // Add handler for board state requests
    uniquesocket.on("request_board_state", () => {
        uniquesocket.emit("boardstate", chess.fen());
    });

    // Handle game reset
    uniquesocket.on("reset_game", () => {
        // Only allow reset if user is a player (white or black)
        if (uniquesocket.id === players.white || uniquesocket.id === players.black) {
            console.log('Game reset requested by:', uniquesocket.id);
            chess.reset();
            // Broadcast reset to all clients
            io.emit("boardstate", chess.fen());
            io.emit("game_reset");
            console.log('Game reset successful');
        } else {
            console.log('Reset denied - user is not a player');
        }
    });

    uniquesocket.on('disconnect', () => {
        console.log('User disconnected');
        // Remove player from game when they disconnect
        if (players.white === uniquesocket.id) {
            players.white = null;
        } else if (players.black === uniquesocket.id) {
            players.black = null;
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
