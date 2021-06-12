function ResetMoves(){
    //Reset the en pasants
    while(potential_moves.length){
        var pot = potential_moves[potential_moves.length - 1]
        var tile = document.getElementById(pot.y + ',' + pot.x);
        if(tile.firstChild)
            tile.removeChild(tile.firstChild);
        potential_moves.pop();
    }
    while(potential_attacks.length){
        var pot = potential_attacks[potential_attacks.length - 1]
        var tile = document.getElementById(pot.y + ',' + pot.x);
        ResetOriginalPieceEventListener(tile,pot.x,pot.y);
        tile.style.background = (pot.y % 2 ? (pot.x % 2 ? "gray" : "white") : (pot.x % 2 ? "white" : "gray"));
        potential_attacks.pop();
    }
}

function ResetOriginalPieceEventListener(tile, x, y){
    var curr_ = tile.firstChild;
    if(!curr_)
        return;
    switch(curr_.getAttribute("src")[7]){
        case "B": 
            for(var a = 0; a < black_pieces.length; a++){
                if(black_pieces[a].x == x && black_pieces[a].y == y){
                    var new_img = document.createElement("img");
                    new_img.setAttribute("src", curr_.getAttribute("src"));
                    black_pieces[a].img = new_img;
                    tile.removeChild(tile.firstChild);
                    tile.appendChild(black_pieces[a].img)
                    black_pieces[a].SetEventListener();
                }
            }
        default:
            for(var a = 0; a < white_pieces.length; a++){
                if(white_pieces[a].x == x && white_pieces[a].y == y){
                    var new_img = document.createElement("img");
                    new_img.setAttribute("src", curr_.getAttribute("src"));
                    white_pieces[a].img = new_img;
                    tile.removeChild(tile.firstChild);
                    tile.appendChild(white_pieces[a].img)
                    white_pieces[a].SetEventListener();
                }
            }
    }
}

function CapturePiece(color, x, y){
    switch(color){
        case "black": 
            for(var a = 0; a < black_pieces.length; a++){
                if(black_pieces[a].x == x && black_pieces[a].y == y){
                    var tile = document.getElementById(y + ',' + x);
                    tile.removeChild(black_pieces[a].img);
                    black_pieces.splice(a, 1);
                    return tile;
                }
            }
        default:
            for(var a = 0; a < white_pieces.length; a++){
                if(white_pieces[a].x == x && white_pieces[a].y == y){
                    var tile = document.getElementById(y + ',' + x);
                    tile.removeChild(white_pieces[a].img);
                    white_pieces.splice(a, 1);
                    return tile;
                }
            }
    }
}

function ResetCurrentPlayersPawns(){
    switch(current_turn){
        case turn.black: 
            for(var a = 0; a < black_pieces.length; a++){
                black_pieces[a].en_pasant = false;
                black_pieces[a].img.setAttribute("enpasant", false);
            }
            break;
        default:
            for(var a = 0; a < white_pieces.length; a++){
                white_pieces[a].en_pasant = false;
                white_pieces[a].img.setAttribute("enpasant", false);
            }
            break;
    }
}

function MoveLaterally(x,y,enemy){
    var dirx = [-1,0,1,0]
    var diry = [0,1,0,-1]
    for(var i = 0; i < 4; i++){
        for(var a = x+dirx[i], b = y+diry[i]; a > -1 && b > -1 && a < 8 && b < 8; a+= dirx[i], b += diry[i]){
            var tile = document.getElementById(b + ',' + a + ',img');
            if(!tile){
                if(!LegalMove(x,y,a,b)){
                    //check if it is legal
                    continue;
                }
                potential_moves.push({
                    x: a,
                    y: b,
                })
            } 
            else{
                var src = tile.getAttribute("src");
                if(src[7] == enemy){
                    if(!LegalMove(x,y,a,b)){
                        //check if legal
                        continue
                    }
                    potential_attacks.push({
                        x: a,
                        y: b,
                        ep: false
                    })
                    if(src[8] == "K" && src[9] != "n")
                        return true //Indicate this piece is checking the enemy
                }
                break;
            }
        }
    }
    return false;
}

function MoveDiagonally(x,y,enemy){
    //Check upper left
    var dirx = [-1,-1,1,1]
    var diry = [1,-1,1,-1]
    for(var i = 0; i < 4; i++){
        for(var a = x+dirx[i], b = y+diry[i]; a > -1 && b > -1 && a < 8 && b < 8; a+= dirx[i], b += diry[i]){
            var tile = document.getElementById(b + ',' + a + ',img');
            if(!tile){
                if(!LegalMove(x,y,a,b)){
                    //Check if it is legal
                    continue;
                }
                potential_moves.push({
                    x: a,
                    y: b,
                })
            } 
            else{
                var src = tile.getAttribute("src")
                if(!LegalMove(x,y,a,b)){
                    continue;
                }
                if(src[7] == enemy){
                    if(!LegalMove(x,y,a,b)){
                        //Check if it legal
                        break;
                    }
                    potential_attacks.push({
                        x: a,
                        y: b,
                        ep: false
                    })
                }
                break;
            }
        }
    }
}

function LegalMove(xi,yi,xo,yo){
    var prev_tile = document.getElementById(yi + ',' + xi);
    var next_tile = document.getElementById(yo + ',' + xo);
    var holder = null;
    var result = true;
    if(next_tile.firstChild){
        holder = next_tile.firstChild;
        next_tile.removeChild(next_tile.firstChild);
    }
    next_tile.appendChild(prev_tile.firstChild);
    //Checking logic
    switch(current_turn){
        case turn.white:
            for(const b of black_pieces){
                if(b.x == xo && b.y == yo){
                    //We captured
                    continue;
                }
                else if(b.type == "pawn" && PawnChecking(b.x,b.y,b.direction,current_turn))
                    result = false;
                else if((b.type == "rook" || b.type == "queen") && LateralChecking(b.x,b.y,current_turn)){
                    result = false;
                }
                else if((b.type == "bishop" || b.type == "queen") && DiagonalChecking(b.x,b.y,current_turn)){
                    result = false;
                }
                else if(b.type == "knight"){
                    if(KnightChecking(b.x,b.y,current_turn))
                        result = false;
                }
                else if(b.type == "king" && KingChecking(b.x,b.y,current_turn))
                    result = false;
            }
            break;
        case turn.black:
            for(const w of white_pieces){
                if(w.x == xo && w.y == yo){
                    continue;
                }
                else if(w.type == "pawn" && PawnChecking(w.x,w.y,w.direction,current_turn))
                    result = false;
                else if((w.type == "rook" || w.type == "queen") && LateralChecking(w.x,w.y,current_turn)){
                    result = false;
                }
                else if((w.type == "bishop" || w.type == "queen") && DiagonalChecking(w.x,w.y,current_turn)){
                    result = false;
                }
                else if(w.type == "knight"){
                    if(KnightChecking(w.x,w.y,current_turn))
                        result = false;
                }
                else if(w.type == "king" && KingChecking(w.x,w.y,current_turn))
                    result = false;
            }
            break;
    }
    prev_tile.appendChild(next_tile.firstChild);
    if(holder){
        next_tile.appendChild(holder);
    }
    return result;
}

function Checkmate(){
    switch(current_turn){
        case turn.black:
            for(const p of black_pieces){
                p.Move();
                if(potential_attacks.length || potential_moves.length){
                    ResetMoves();
                    return false;
                }
            }
            ResetMoves();
            return true;
        case turn.white:
            for(const w of white_pieces){
                w.Move();
                if(potential_attacks.length || potential_moves.length){
                    ResetMoves();
                    return false;
                }
            }
            ResetMoves();
            return true;
    }
}

function EnablePromote(p, piece){
    console.log("promoted")
    ResetMoves();
    var tile = document.getElementById(p.y + ',' + p.x);
    var prev = document.getElementById(piece.y + ',' + piece.x);
    console.log(prev);
    var options = ["Q", "R", "B", "Kn"];
    var new_piece = null;
    if(tile.firstChild) tile.removeChild(tile.firstChild);
    if(prev.firstChild) {
        prev.removeChild(prev.firstChild);
    }
    promote_box.style.background = piece.color == "W" ? "black" : "white";
    switch(piece.color){
        case "B":
            for(var a = 0; a < white_pieces.length; a++){
                var curr = white_pieces[a];
                if(curr.x == p.x && curr.y == p.y){
                    white_pieces.splice(a, 1);
                    break;
                }
            }
            break;
        default:
            for(var a = 0; a < black_pieces.length; a++){
                var curr = black_pieces[a];
                if(curr.x == p.x && curr.y == p.y){
                    black_pieces.splice(a,1);
                    break;
                }
            }
            break;
    }
    for(const o of options){
        var new_ = document.createElement("img");
        new_.setAttribute("src", "Pieces/" + piece.color + o + ".png");
        new_.setAttribute("type", "promotion")
        new_.addEventListener("click", () =>{
            //Reset the promote box
            current_turn = piece.color == "B" ? turn.white: turn.black;
            while(promote_box.firstChild) promote_box.removeChild(promote_box.firstChild)
            promote_box.setAttribute("enable", "false");
            game_page.appendChild(promote_box);
            console.log(o);
            var src_ = "Pieces/" + piece.color + o + ".png";
            switch(o){
                case "Q":
                    new_piece = new Queen(p.x, p.y, piece.color, 0, src_);
                    break;
                case "R":
                    new_piece = new Rook(p.x, p.y, piece.color, 0, src_);
                    break;
                case "Kn":
                    new_piece = new Knight(p.x,p.y,piece.color, 0, src_);
                    break;
                default:
                    new_piece = new Bishop(p.y,p.y,piece.color, 0, src_);
                    break;
            }
            new_piece.Initialize();
            new_piece.Render();
            switch(piece.color){
                case "B":
                    for(var a = 0; a < black_pieces.length; a++){
                        var b = black_pieces[a]
                        console.log((b.y + ',' + b.x).toString())
                        if(b.x == piece.x && b.y == piece.y){
                            black_pieces[a] = new_piece;
                            break;
                        }
                    }
                    break;
                default:
                    for(var a = 0; a < white_pieces.length; a++){
                        var w = white_pieces[a]
                        console.log((w.y + ',' + w.x).toString())
                        if(w.x == piece.x && w.y == piece.y){
                            white_pieces[a] = new_piece;
                            break;
                        }
                    }
                    break;
            }
        })
        promote_box.appendChild(new_);
    }
    promote_box.setAttribute("enable", "true");
    tile.appendChild(promote_box)
}