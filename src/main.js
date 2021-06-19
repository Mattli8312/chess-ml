//DOM data
const board = document.getElementById("board");
const promote_box = document.getElementById("promotebox");
const main_page = document.getElementById("main_page");
const creategameMode = document.getElementById("creategameMode");
const game_page = document.getElementById("game_page");
const load_page = document.getElementById("loading_page");
const bullet = document.getElementById("3min");
const blitz = document.getElementById("5min");
const rapid = document.getElementById("10min");
const black_clk = document.getElementById("black_clock");
const white_clk = document.getElementById("white_clock");
const MoveHistory = document.getElementById("MoveHistory");
const winnerPage = document.getElementById("winnerPage");
const winner = document.getElementById("winner");
//Client data
const black_pieces = [];
const white_pieces = [];
const potential_moves = [];
const potential_attacks = [];
const turn = {
    black: "B",
    white: "W",
    white_winner: "WW",
    black_winner: "BW",
    none: "N"
}
const games = {
    rapid: 10,
    blitz: 5,
    bullet: 3
}
//Server data
const black_clock = {
    min: 10,
    sec: 0
}
const white_clock = {
    min: 10,
    sec: 0
}
var game_enabled, MasterClock = null;
var current_turn, selected_highlighter, current_color;
var move_counter, current_game_mode; 
var load_counter = 0;
var number_coords = ['8','7','6','5','4','3','2','1'];
var letter_coords = ['a','b','c','d','e','f','g','h'];

/**
 * Game Initialization logic
 */
function Initialize_board(){
    //First erase all previous tiles
    while(board.firstChild)
        board.removeChild(board.firstChild);
    for(var a = 0; a < 8; a++){
        for(var b = 0; b < 8; b++){
            var color_ = (!(a % 2)? (b % 2 ? "gray" : "white") : (b % 2 ? "white" : "gray"))
            var tile_ = document.createElement("div");
            tile_.setAttribute("type","space");
            tile_.setAttribute("id", a + ',' + b)
            tile_.style.background = color_;
            board.appendChild(tile_);
        }
    }
}

function Initialize_pieces(flip){
    //Initializing Pawns
    for(var a = 0; a < 8; a++){
        var new_black_piece = new Pawn(a, !flip ? 1 : 6, "B", !flip ? 1 : -1, "Pieces/BP.png");
        var new_white_piece = new Pawn(a, !flip ? 6 : 1, "W", !flip ? -1: 1, "Pieces/WP.png");
        new_white_piece.Initialize();
        new_black_piece.Initialize();
        new_white_piece.Render();
        new_black_piece.Render();
        black_pieces.push(new_black_piece);
        white_pieces.push(new_white_piece);
    }
    //Initializing Rooks
    for(var a = 0; a < 8; a++){
        if(a == 0 || a == 7){
            //Initialize the rooks
            var black_rook = new Rook(a, !flip ? 0 : 7, "B", 0, "Pieces/BR.png");
            var white_rook = new Rook(a, !flip ? 7 : 0, "W", 0, "Pieces/WR.png");
            black_rook.Initialize(); white_rook.Initialize();
            black_rook.Render(); white_rook.Render();
            black_pieces.push(black_rook); white_pieces.push(white_rook);
        }
        else if(a == 1 || a == 6){
            var black_knight = new Knight(a, !flip ? 0 : 7, "B", 0, "Pieces/BKn.png");
            var white_knight = new Knight(a, !flip ? 7 : 0, "W", 0, "Pieces/WKn.png");
            black_knight.Initialize(); white_knight.Initialize();
            black_knight.Render(); white_knight.Render();
            black_pieces.push(black_knight); white_pieces.push(white_knight);
        }
        else if(a == 2 || a == 5){
            var black_bishop = new Bishop(a, !flip ? 0 : 7, "B", 0, "Pieces/BB.png");
            var white_bishop = new Bishop(a, !flip ? 7 : 0, "W", 0, "Pieces/WB.png");
            black_bishop.Initialize(); white_bishop.Initialize();
            black_bishop.Render(); white_bishop.Render();
            black_pieces.push(black_bishop); white_pieces.push(white_bishop);
        }
        else if((a== 3 && !flip) || (a == 4 && flip)){
            var black_queen = new Queen(a, !flip ? 0 : 7, "B", 0, "Pieces/BQ.png");
            var white_queen = new Queen(a, !flip ? 7 : 0, "W", 0, "Pieces/WQ.png");
            black_queen.Initialize(); white_queen.Initialize();
            black_queen.Render(); white_queen.Render();
            black_pieces.push(black_queen); white_pieces.push(white_queen);
        }
        else{
            var black_king = new King(a, !flip ? 0 : 7, "B", 0, "Pieces/BK.png");
            var white_king = new King(a, !flip ? 7 : 0, "W", 0, "Pieces/WK.png");
            black_king.Initialize(); white_king.Initialize();
            black_king.Render(); white_king.Render();
            black_pieces.push(black_king); white_pieces.push(white_king);
        }
    }
}

function Reset_board(){
    while(black_pieces.length) black_pieces.pop();
    while(white_pieces.length) white_pieces.pop();
    while(board.firstChild) board.removeChild(board.firstChild);
    current_turn = turn.white;
    selected_highlighter = null;
}

function NewGame(type = games.rapid, flip = false){
    winnerPage.setAttribute("enable", "false");
    game_page.setAttribute("enable", "true");
    main_page.setAttribute("enable","false");
    load_page.setAttribute("enable", "false");
    board.setAttribute("enable","true");
    game_enabled = true;
    while(MoveHistory.firstChild) MoveHistory.removeChild(MoveHistory.firstChild);
    var move_title = document.createElement("h1"); move_title.innerHTML = "Moves:";
    MoveHistory.appendChild(move_title);
    current_game_mode = type;
    current_turn = turn.white;
    white_clock.min = black_clock.min = type;
    white_clock.sec = black_clock.sec = 0;
    move_counter = 1;
    white_clk.innerHTML = white_clock.sec < 10 ? white_clock.min + ':0' + white_clock.sec : white_clock.min + ':' + white_clock.sec;
    black_clk.innerHTML = black_clock.sec < 10 ? black_clock.min + ':0' + black_clock.sec : black_clock.min + ':' + black_clock.sec;
    Reset_board();
    Initialize_board();
    Initialize_pieces(flip);
}

function MainPage(){
    creategameMode.setAttribute("enable", "false");
    main_page.setAttribute("enable", "true");
    game_page.setAttribute("enable", "false");
    load_page.setAttribute("enable", "false");
    board.setAttribute("enable", "false");
    game_enabled = false;
}

function GamePage(){
    creategameMode.setAttribute("enable", "true");
}

function LoadingPage(game_mode){
    game_page.setAttribute("enable", "false");
    main_page.setAttribute("enable", "false");
    load_page.setAttribute("enable", "true");
    current_game_mode = game_mode;
    console.log("Emitting");
    socket.emit("CreateGame");
}

function HandleJoinRoom(){
    var input_ = document.getElementById("join");
    console.log(input_.value);
    if(input_.value.length < 5) alert("Invalid gamecode: must contain 5 characters");
    else{
        game_code = input_.value;
        socket.emit("ChangeRooms", game_code);
    }
}

function Winner(transmit = true){
    if(transmit)
        socket.emit("WinnerData", current_turn);
    var notation = "";
    game_enabled = false;
    switch(current_turn){
        case turn.white_winner:
            notation = "White Won!"
            break;
        case turn.black_winner:
            notation = "Black Won!"
            break;
        default:
            alert("Error with receiving winner");
    }
    setTimeout(()=>{
        winner.innerHTML = notation;
        console.log("reached");
        winnerPage.setAttribute("enable", "true");
    }, 1000)
}

function RematchRequest(){
    /**@todo */
    socket.emit("RematchRequest");
}

function RematchDecline(){
    winnerPage.setAttribute("enable", "false");
}

function BackButton(){
    MainPage();
    if(MasterClock != null) clearInterval(MasterClock);
    player_number = 0;
    socket.emit("PlayerDisconnect", game_code);
}

LoadClock = setInterval(()=>{
    switch(load_counter % 3){
        case 0:
            document.getElementById("bar1").setAttribute("enable", "high");
            document.getElementById("bar3").setAttribute("enable", "low");
            break;
        case 1:
            document.getElementById("bar2").setAttribute("enable", "high");
            document.getElementById("bar1").setAttribute("enable", "low");
            break;
        default:
            document.getElementById("bar3").setAttribute("enable", "high");
            document.getElementById("bar2").setAttribute("enable", "low");
            break;
    }
    load_counter ++;
},500)