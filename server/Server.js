const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

function GameCodeGenerator(){
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for(var a = 0; a < 5; a++){
        var sel = Math.floor(Math.random() * characters.length);
        result += characters[sel];
    }
    return result;
}

app.use(express.static('src'))

io.on('connection', (socket) =>{
    console.log("New User has connected");
    /**
     * Transmission
     */
    var game_code = GameCodeGenerator();
    /**
     * Receival/Response
     */
    socket.on("CreateGame", ()=>{
        console.log(game_code);
        socket.join(game_code);
        socket.emit("Connected", game_code);
    })
    socket.on("ChangeRooms", (input_code)=>{
        socket.leave(game_code);
        game_code = input_code;
        socket.join(game_code);
        socket.to(game_code).emit("PlayerConnected");
    })
    socket.on("Handshake", (current_game_mode)=>{
        socket.to(game_code).emit("HandshakeComplete", current_game_mode);
    })
    /**
     * Data
     */
    //Clock data
    socket.on("ClockData", (clocks)=>{ socket.to(game_code).emit("Clocks", clocks) });
    //Turn data
    socket.on("TurnData", (turn)=>{ socket.to(game_code).emit("Turn", turn) });
    //Movement History Data
    socket.on("MoveHistory", (notation)=>{ socket.to(game_code).emit("Move", notation) });
    //Physical Movement
    socket.on("UpdateMovement", (data)=>{ socket.to(game_code).emit("UpdateMove", data)});
    //Promote Piece
    socket.on("PromotePiece", (data)=>{ socket.to(game_code).emit("Promote", data)});
})

server.listen(PORT, () =>{
    console.log("Listening on Port " + PORT.toString());
})