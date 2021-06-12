const board = document.getElementById("board");
const promote_box = document.getElementById("promotebox")
const game_page = document.getElementById("game_page")
const black_pieces = [];
const white_pieces = [];
const potential_moves = [];
const potential_attacks = [];
const turn = {
    black: "B",
    white: "W",
    none: "N"
}
var current_turn, selected_highlighter;

function Initialize_board(){
    //First erase all previous tiles
    while(board.firstChild)
        board.removeChild(board.firstChild);
    for(var a = 0; a < 8; a++){
        for(var b = 0; b < 8; b++){
            var color_ = (a % 2 ? (b % 2 ? "gray" : "white") : (b % 2 ? "white" : "gray"))
            var tile_ = document.createElement("div");
            tile_.setAttribute("type","space");
            tile_.setAttribute("id", a + ',' + b)
            tile_.style.background = color_;
            board.appendChild(tile_);
        }
    }
}

function Initialize_pieces(){
    //Initializing Pawns
    for(var a = 0; a < 8; a++){
        var new_black_piece = new Pawn(a, 1, "B", 1, "Pieces/BP.png")
        var new_white_piece = new Pawn(a, 6, "W", -1, "Pieces/WP.png")
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
            var black_rook = new Rook(a, 0, "B", 0, "Pieces/BR.png");
            var white_rook = new Rook(a, 7, "W", 0, "Pieces/WR.png");
            black_rook.Initialize(); white_rook.Initialize();
            black_rook.Render(); white_rook.Render();
            black_pieces.push(black_rook); white_pieces.push(white_rook);
        }
        else if(a == 1 || a == 6){
            var black_knight = new Knight(a, 0, "B", 0, "Pieces/BKn.png");
            var white_knight = new Knight(a, 7, "W", 0, "Pieces/WKn.png");
            black_knight.Initialize(); white_knight.Initialize();
            black_knight.Render(); white_knight.Render();
            black_pieces.push(black_knight); white_pieces.push(white_knight);
        }
        else if(a == 2 || a == 5){
            var black_bishop = new Bishop(a, 0, "B", 0, "Pieces/BB.png");
            var white_bishop = new Bishop(a, 7, "W", 0, "Pieces/WB.png");
            black_bishop.Initialize(); white_bishop.Initialize();
            black_bishop.Render(); white_bishop.Render();
            black_pieces.push(black_bishop); white_pieces.push(white_bishop);
        }
        else if(a== 3){
            var black_queen = new Queen(a, 0, "B", 0, "Pieces/BQ.png");
            var white_queen = new Queen(a, 7, "W", 0, "Pieces/WQ.png");
            black_queen.Initialize(); white_queen.Initialize();
            black_queen.Render(); white_queen.Render();
            black_pieces.push(black_queen); white_pieces.push(white_queen);
        }
        else{
            var black_king = new King(a, 0, "B", 0, "Pieces/BK.png");
            var white_king = new King(a, 7, "W", 0, "Pieces/WK.png");
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

function NewGame(){
    Reset_board();
    Initialize_board();
    Initialize_pieces();
}

NewGame();