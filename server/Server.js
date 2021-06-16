const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);


app.use(express.static('src'))

io.on('connection', (socket) =>{
    console.log("New User has connected");
    socket.on("Connected", (load_counter)=>{
        console.log("Yes!");
        console.log(load_counter);
    })
})

server.listen(PORT, () =>{
    console.log("Listening on Port " + PORT.toString());
})