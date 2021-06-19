/**
 * Socket/Server connection
 */
var game_code; player_number = 0;
var socket = io();
//Initialize current player's default game code
socket.on("Connected", (socket_code)=> { //Player 1
    game_code = socket_code;
    console.log(game_code);
    player_number++;
    document.getElementById("loadcode").innerHTML = "You Game Code: " + game_code;
    current_color = turn.white;
    /**
     * Player 1 will control the master clock which's data will be sent to Player 2
     */
    Clock();
});
//Joining a room
socket.on("PlayerConnected", ()=>{ 
    if(player_number < 2){ 
        socket.emit("Handshake", current_game_mode);
        player_number++;
        NewGame(current_game_mode, false);
        console.log(current_game_mode);
    }
    else{
        alert("Game Room Full!")
        socket.emit("GameFull"); /**@todo */
    }
});
socket.on("HandshakeComplete", (game_mode)=>{
    current_color = turn.black; //Player 2;
    current_game_mode = game_mode;
    player_number = 2;
    NewGame(current_game_mode, true);
})
/**Data Retrieval */
socket.on("Clocks", (clocks)=>{
    black_clock.min = clocks.black_clock.min;
    black_clock.sec = clocks.black_clock.sec;
    white_clock.min = clocks.white_clock.min;
    white_clock.sec = clocks.white_clock.sec;
    black_clk.innerHTML = black_clock.sec < 10 ? black_clock.min + ':0' + black_clock.sec : black_clock.min + ':' + black_clock.sec;
    white_clk.innerHTML = white_clock.sec < 10 ? white_clock.min + ':0' + white_clock.sec : white_clock.min + ':' + white_clock.sec;
})
socket.on("Turn", (turn)=>{current_turn = turn;})
socket.on("Move", (notation_)=>{
    var move_tile = document.createElement("div");
    move_tile.innerHTML = notation_;
    move_tile.style.color = "white"; move_tile.style.fontSize = "1.5em";
    MoveHistory.appendChild(move_tile);
    move_counter++;
})
socket.on("UpdateMove", (data)=>{
    switch(current_color){
        case turn.black:
            for(const p of white_pieces){
                if((7 - p.x) == data.x && (7 - p.y) == data.y){
                    var new_tile = document.getElementById((7 - data.yi) + ',' + (7 - data.xi));
                    var prev_tile = null;
                    //En pasant
                    if(data.ep_cap && data.ep_cap > -1) {
                        prev_tile = document.getElementById((7 - data.ep_cap) + ',' + (7 - data.xi));
                        prev_tile.removeChild(prev_tile.firstChild);
                        for(var a = 0; a <  black_pieces.length; a++) 
                            if(black_pieces[a].x == (7 - data.xi) && black_pieces[a].y == (7 - data.ep_cap)) black_pieces.splice(a, 1);
                    }
                    if(new_tile.firstChild) {
                    for(var a = 0; a <  black_pieces.length; a++) 
                        if(black_pieces[a].x == (7 - data.xi) && black_pieces[a].y == (7 - data.yi)) black_pieces.splice(a, 1);
                    new_tile.removeChild(new_tile.firstChild);
                }
                    new_tile.appendChild(p.img);
                    p.x = 7 - data.xi; p.y = 7 - data.yi;
                    p.img.setAttribute("id", p.y + ',' + p.x + ',img');
                    p.img.setAttribute("enpasant", data.ep);
                    p.castle_enable = false; p.img.setAttribute("castle", false);
                    console.log(p);
                    break;
                }
            }
            break;
        default:
            for(const p of black_pieces){
                if((7 - p.x) == data.x && (7 - p.y) == data.y){
                    var new_tile = document.getElementById((7 - data.yi) + ',' + (7 - data.xi));
                    var prev_tile = null;
                    if(data.ep_cap && data.ep_cap > -1) {
                        prev_tile = document.getElementById((7 - data.ep_cap) + ',' + (7 - data.xi));
                        prev_tile.removeChild(prev_tile.firstChild);
                        for(var a = 0; a <  white_pieces.length; a++) 
                            if(white_pieces[a].x == (7 - data.xi) && white_pieces[a].y == (7 - data.ep_cap)) white_pieces.splice(a, 1);
                    }
                    if(new_tile.firstChild) {
                        for(var a = 0; a <  white_pieces.length; a++) 
                            if(white_pieces[a].x == (7 - data.xi) && white_pieces[a].y == (7 - data.yi)) white_pieces.splice(a, 1);
                        new_tile.removeChild(new_tile.firstChild);
                    }
                    new_tile.appendChild(p.img);
                    p.x = 7 - data.xi; p.y = 7 - data.yi;
                    p.img.setAttribute("id", p.y + ',' + p.x + ',img');
                    p.img.setAttribute("enpasant", data.ep);
                    p.castle_enable = false; p.img.setAttribute("castle", false);
                    console.log(p);
                    break;
                }
            }
            break;
    }
})

socket.on("Promote", (data)=>{
    console.log("reached");
    var new_tile = document.getElementById((7-data.y) + ',' + (7-data.x));
    if(new_tile.firstChild) new_tile.removeChild(new_tile.firstChild); 
    switch(current_color){
        case turn.black:
            for(var a = 0; a < white_pieces.length; a++){
                if(white_pieces[a].x == (7-data.x) && white_pieces[a].y == (7-data.y)){
                    switch(data.pp){
                        case "Q": white_pieces[a] = new Queen((7-data.x), (7-data.y), "W", 0, "Pieces/WQ.png"); break;
                        case "R": white_pieces[a] = new Rook((7-data.x), (7-data.y), "W", 0, "Pieces/WR.png"); break;
                        case "Kn": white_pieces[a] = new Knight((7-data.x), (7-data.y), "W", 0, "Pieces/WKn.png"); break;
                        default: white_pieces[a] = new Bishop((7-data.x), (7-data.y), "W", 0, "Pieces/WB.png"); break;
                    }
                    white_pieces[a].Initialize();
                    white_pieces[a].Render();
                    break;
                }
            }
            break;
    default:
        for(var a = 0; a < black_pieces.length; a++){
            if(black_pieces[a].x == (7-data.x) && black_pieces[a].y == (7-data.y)){
                switch(data.pp){
                    case "Q": black_pieces[a] = new Queen((7-data.x), (7-data.y), "B", 0, "Pieces/BQ.png"); break;
                    case "R": black_pieces[a] = new Rook((7-data.x), (7-data.y), "B", 0, "Pieces/BR.png"); break;
                    case "Kn": black_pieces[a] = new Knight((7-data.x), (7-data.y), "B", 0, "Pieces/BKn.png"); break;
                    default: black_pieces[a] = new Bishop((7-data.x), (7-data.y), "B", 0, "Pieces/BB.png"); break;
                }
                black_pieces[a].Initialize();
                black_pieces[a].Render();
                break;
            }
        }
        break;
    }
})
socket.on("Winner", (data)=>{
    current_turn = data;
    Winner(false);
})
socket.on("Disconnect", ()=>{
    //Add message to Move History
    var block = document.createElement("div");
    //Cannot rematch, so close the winnerPage
    winnerPage.setAttribute("enable", "false");
    block.innerHTML = "Game Terminated";
    block.style.color = "white"; block.style.fontSize = "1.5em";
    MoveHistory.appendChild(block);
    move_counter++;
    player_number--;
    //Stop the clock
    if(MasterClock != null) clearInterval(MasterClock);
})
socket.on("RematchReq", ()=>{
    /**@todo */
    rematchbox.setAttribute("enable", "true");
    winnerPage.setAttribute("enable", "false");
    MoveHistory.appendChild(rematchbox);
})
socket.on("RematchRes", (data)=>{
    clearInterval(MasterClock);
    if(data){
        NewGame(current_game_mode, current_color == turn.black);
        Clock();
    }
    else{ 
        MainPage();
        alert("Rematch Declined");
    }
})

function Clock(){
    MasterClock = setInterval(() => {
        if(game_enabled){
            switch(current_turn){
                case turn.black:
                    if(!black_clock.sec) {
                        black_clock.min--; 
                        black_clock.sec = 60
                    };
                    black_clock.sec--;
                    black_clk.innerHTML = black_clock.sec < 10 ? black_clock.min + ':0' + black_clock.sec : black_clock.min + ':' + black_clock.sec;
                    break;
                case turn.white:
                    if(!white_clock.sec) {
                        white_clock.min--;
                        white_clock.sec = 60
                    };
                    white_clock.sec--;
                    white_clk.innerHTML = white_clock.sec < 10 ? white_clock.min + ':0' + white_clock.sec : white_clock.min + ':' + white_clock.sec;
                    break;
            }
            socket.emit("ClockData", {black_clock, white_clock});
        }
    }, 1000);
}