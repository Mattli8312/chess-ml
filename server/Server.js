const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

export function GameCodeGenerator(){
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for(var a = 0; a < 5; a++){
        var sel = Math.floor(Math.random() * characters.length);
        result += characters[sel];
    }
    return result;
}
var game_rooms = new Map();

app.use(express.static('src'))

io.on('connection', (socket) =>{
    console.log("New User has connected");
    /**
     * Transmission
     */
    var socket_code = GameCodeGenerator();
    if(!game_rooms.has(socket_code)) game_rooms[socket_code] = 1;
    else{
        game_rooms[socket_code] ++;
        if(game_rooms[socket_code] < 2)// emit connected signal 
            console.log("connected");
        else console.log("Game room already contains two players");
    }
    socket.emit("gamecode", socket_code);
    /**
     * Receival
     */
})

server.listen(PORT, () =>{
    console.log("Listening on Port " + PORT.toString());
})