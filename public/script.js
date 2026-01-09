// Socket.IO Initialization
const socket = io();

// Chess Game Initialization
const chess = new Chess();

// DOM Elements
const boardElement = document.querySelector("#chessboard");
const playerRoleElement = document.querySelector("#playerRole");
const gameStatusElement = document.querySelector("#gameStatus");
const turnIndicatorElement = document.querySelector("#turnIndicator");
const gameInfoElement = document.querySelector("#gameInfo");
const movesListElement = document.querySelector("#movesList");

// Game state
let playerRole = null;
let draggedPiece = null;
let draggedFrom = null;
let moveHistory = [];

// Unicode Chess Pieces
const pieces = {
    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
};

// Socket.IO Event: Receive player role assignment
socket.on("playerrole", (role) => {
    playerRole = role;
    console.log("Player role assigned:", role);
    playerRoleElement.textContent = `You are: ${role === 'white' ? '⚪ White' : '⚫ Black'}`;
    gameStatusElement.textContent = 'Waiting for opponent...';
    // Show reset button for players (not spectators)
    const resetBtn = document.querySelector("#resetBtn");
    if (resetBtn) {
        resetBtn.style.display = "block";
    }
    renderBoard();
    updateGameInfo();
});

// Socket.IO Event: Spectator role assignment
socket.on("spectatorRole", (role) => {
    playerRole = "spectator";
    console.log("Spectator role assigned");
    playerRoleElement.textContent = "👁️ You are a Spectator";
    gameStatusElement.textContent = "Game in progress - watching";
    gameInfoElement.textContent = "You can view but not play";
    // Hide reset button for spectators
    const resetBtn = document.querySelector("#resetBtn");
    if (resetBtn) {
        resetBtn.style.display = "none";
    }
    renderBoard();
    updateGameInfo();
});

// Socket.IO Event: Receive initial or updated board state
socket.on("boardstate", (fen) => {
    console.log("Received board state:", fen);
    chess.load(fen);
    renderBoard();
    updateGameInfo();
});

// Socket.IO Event: Receive opponent's move
socket.on("move_made", (moveData) => {
    console.log("Move received from server:", moveData);
    chess.load(moveData.fen);
    const colorThatMoved = moveData.turn === 'w' ? 'black' : 'white';
    addMoveToHistory(moveData.from, moveData.to, colorThatMoved);
    renderBoard();
    updateGameInfo();
});

// Socket.IO Event: Invalid move notification
socket.on("invalid_move", (message) => {
    gameInfoElement.textContent = `Invalid: ${message}`;
    console.log("Invalid move:", message);
});

// Function: Update game information display
function updateGameInfo() {
    const turn = chess.turn();
    turnIndicatorElement.textContent = `Turn: ${turn === 'w' ? '⚪ White' : '⚫ Black'}`;
    
    const container = document.querySelector('.container');
    
    if (chess.isCheckmate()) {
        const winner = chess.turn() === 'w' ? 'Black' : 'White';
        gameStatusElement.textContent = `🎉 CHECKMATE! ${winner} wins!`;
        gameInfoElement.textContent = 'Game Over - Checkmate';
        gameStatusElement.style.fontSize = '1.3em';
        gameStatusElement.style.color = '#27ae60';
        gameStatusElement.style.fontWeight = 'bold';
        container.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
        container.style.borderLeft = '5px solid #27ae60';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
        turnIndicatorElement.textContent = '✓ Game Finished';
    } else if (chess.isCheck()) {
        gameStatusElement.textContent = `⚠️ ${chess.turn() === 'w' ? 'White' : 'Black'} is in check!`;
        gameStatusElement.style.color = '#e74c3c';
        gameStatusElement.style.fontWeight = 'bold';
        gameInfoElement.textContent = '⚠️ Check!';
    } else if (chess.isDraw()) {
        gameStatusElement.textContent = '🤝 Draw!';
        gameInfoElement.textContent = 'Game is a draw';
        gameStatusElement.style.color = '#f39c12';
        gameStatusElement.style.fontWeight = 'bold';
        container.style.backgroundColor = 'rgba(243, 156, 18, 0.1)';
        container.style.borderLeft = '5px solid #f39c12';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
    } else if (playerRole === 'spectator') {
        gameStatusElement.textContent = 'Observing game...';
        gameStatusElement.style.color = '#3498db';
    } else {
        const isMyTurn = (playerRole === 'white' && turn === 'w') || (playerRole === 'black' && turn === 'b');
        if (isMyTurn) {
            gameStatusElement.textContent = '✅ Your turn!';
            gameStatusElement.style.color = '#27ae60';
        } else {
            gameStatusElement.textContent = '⏳ Opponent\'s turn';
            gameStatusElement.style.color = '#9b59b6';
        }
        gameStatusElement.style.fontWeight = 'bold';
    }
}

// Function: Add move to moves history display
function addMoveToHistory(from, to, color) {
    const moveEntry = document.createElement('div');
    moveEntry.className = `move-entry ${color}-move`;
    moveEntry.textContent = `${color === 'white' ? 'White' : 'Black'}: ${from} → ${to}`;
    movesListElement.appendChild(moveEntry);
    movesListElement.scrollTop = movesListElement.scrollHeight;
}

// Function: Render the chessboard
function renderBoard() {
    boardElement.innerHTML = "";
    const board = chess.board();
    
    // Flip board for black player
    const isFlipped = playerRole === 'black';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            // Calculate actual row/col based on player perspective
            let actualRow = isFlipped ? 7 - row : row;
            let actualCol = isFlipped ? 7 - col : col;
            
            const square = document.createElement("div");
            
            // Determine square color
            const isLight = (actualRow + actualCol) % 2 === 0;
            square.className = isLight ? "square light" : "square dark";
            
            // Create file and rank notation
            const file = String.fromCharCode(97 + actualCol);
            const rank = 8 - actualRow;
            square.dataset.square = file + rank;
            
            // Add piece if present
            const piece = board[actualRow][actualCol];
            if (piece) {
                const pieceEl = document.createElement("div");
                pieceEl.className = piece.color === 'w' ? "piece white" : "piece black";
                pieceEl.textContent = pieces[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()];
                
                // Only allow dragging if:
                // 1. Player is not a spectator
                // 2. It's their turn
                // 3. It's their piece
                const isMyPiece = piece.color === (playerRole === 'white' ? 'w' : 'b');
                const isMyTurn = (playerRole === 'white' && chess.turn() === 'w') || (playerRole === 'black' && chess.turn() === 'b');
                pieceEl.draggable = playerRole !== "spectator" && isMyPiece && isMyTurn;
                
                if (pieceEl.draggable) {
                    pieceEl.addEventListener("dragstart", handleDragStart);
                    pieceEl.addEventListener("dragend", handleDragEnd);
                }
                
                square.appendChild(pieceEl);
            }
            
            // Add drag over and drop listeners
            square.addEventListener("dragover", handleDragOver);
            square.addEventListener("drop", (e) => handleDrop(e, actualRow, actualCol));
            
            boardElement.appendChild(square);
        }
    }
}

// Function: Handle drag start
function handleDragStart(e) {
    draggedPiece = e.target;
    draggedPiece.classList.add("dragging");
    draggedFrom = e.target.parentElement.dataset.square;
    e.dataTransfer.effectAllowed = "move";
    
    // Highlight valid moves
    highlightValidMoves(draggedFrom);
}

// Function: Handle drag end
function handleDragEnd(e) {
    if (draggedPiece) {
        draggedPiece.classList.remove("dragging");
    }
    clearHighlights();
}

// Function: Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

// Function: Handle drop
function handleDrop(e, row, col) {
    e.preventDefault();
    clearHighlights();
    
    if (!draggedFrom) {
        draggedPiece = null;
        return;
    }
    
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    const to = file + rank;
    
    console.log(`Attempting move from ${draggedFrom} to ${to}`);
    
    if (draggedFrom && draggedFrom !== to) {
        // Emit move to server
        socket.emit("move", {
            from: draggedFrom,
            to: to
        });
    }
    
    draggedPiece = null;
    draggedFrom = null;
}

// Function: Highlight valid moves for a piece
function highlightValidMoves(square) {
    const moves = chess.moves({ square: square, verbose: true });
    
    moves.forEach(move => {
        const targetSquare = document.querySelector(`[data-square="${move.to}"]`);
        if (targetSquare) {
            targetSquare.classList.add("valid-move");
        }
    });
}

// Function: Clear all highlights
function clearHighlights() {
    document.querySelectorAll(".square").forEach(sq => {
        sq.classList.remove("valid-move", "highlight");
    });
}

// Function: Reset the game
function resetGame() {
    // Prevent spectators from resetting the game
    if (playerRole === "spectator") {
        return;
    }
    if (confirm("Reset the game? This cannot be undone!")) {
        chess.reset();
        moveHistory = [];
        movesListElement.innerHTML = "";
        renderBoard();
        updateGameInfo();
        socket.emit("reset_game");
    }
}

// Initial render
console.log("Initializing chess game...");
playerRoleElement.textContent = "Connecting to server...";
gameStatusElement.textContent = "Waiting for role assignment...";
// Hide reset button initially until role is assigned
const resetBtn = document.querySelector("#resetBtn");
if (resetBtn) {
    resetBtn.style.display = "none";
}
renderBoard();
updateGameInfo();
