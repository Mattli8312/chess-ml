class Piece{
    constructor(x, y, color, direction, src){
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = direction;
        this.src = src;
        this.move_set = this.attack_set = [];
        this.castle_enable = false;
        this.en_pasant = false;
    }
    Render(){
        var tile_ = document.getElementById(this.y + ',' + this.x);
        var img = document.createElement('img');
        this.img = img;
        this.SetEventListener();
        tile_.appendChild(img);
    }
    SetEventListener(){
        this.img.setAttribute("src", this.src);
        this.img.setAttribute("type", "piece");
        this.img.setAttribute("id", this.y + ',' + this.x + ',img')
        this.img.setAttribute("enpasant", this.en_pasant);
        this.img.setAttribute("castle", this.castle_enable);
        this.img.addEventListener('click', ()=>{
            if(current_turn == this.color && current_turn == current_color){
                if(selected_highlighter != null)
                    selected_highlighter.style.background = "none";
                this.img.style.background = "rgba(0,255,128,0.5)";
                selected_highlighter = this.img;
                this.Move();
                this.Capture();
            }
        })
    }
    AddMove(p, capture = false){
        var new_move = document.createElement("div");
        var notation = move_counter.toString() + '. ';
        var checkmate = false;
        new_move.style.color = "white"; new_move.style.fontSize = "1.5em";
        if(this.type != "pawn") 
            notation += this.type != "knight" ? this.src[8] : 'N';
        if(capture){ 
            if(this.type == "pawn") notation += letter_coords[current_color == turn.white ? p.x : 7 - p.x];
            notation += 'x';
        }
        notation += letter_coords[current_color == turn.white ? this.x : 7 - this.x] + number_coords[current_color == turn.white ? this.y : 7 - this.y]; 
        if(Checkmate()){
            notation += "#";
            checkmate = true;
        }
        else if(Check()) notation += "+";
        if(p.castle){
            notation = move_counter.toString() + '.';
            if((p.delx < 0) ^ (current_color == turn.black)) notation += " O-O-O";
            else notation += " O-O";
        }
        new_move.innerHTML = notation;
        MoveHistory.appendChild(new_move);
        move_counter ++;
        //Data Transmission
        socket.emit("MoveHistory", notation);
        return checkmate;
    }
    MoveEventListener(p){
        var next = document.getElementById(p.y + ',' + p.x);
        var next_tile = document.createElement("div");
        next_tile.setAttribute("type", "select");
        next_tile.setAttribute("id", p.y + ',' + p.x + ',sel');
        next_tile.addEventListener("click", ()=>{
            if(this.type == "pawn" && (p.y == 0 || p.y == 7)) {
                EnablePromote(p, this, current_turn);
                current_turn = turn.none;
                return;
            }
            var new_tile = document.getElementById(p.y + ','  + p.x);
            var checker = document.getElementById(p.y + ',' + (p.x + 1) + ',img');
            var checker2 = document.getElementById(p.y + ',' + (p.x - 1) + ',img');
            var enemy_color = this.color == "B" ? "W" : "B";
            if(this.type == "pawn" && Math.abs(p.y - this.y) == 2 && (checker || checker2)){
                if(checker && checker.getAttribute("src")[7] + checker.getAttribute("src")[8] == enemy_color + 'P'){
                    this.en_pasant = true;
                }
                if(checker2 && checker2.getAttribute("src")[7] + checker2.getAttribute("src")[8] == enemy_color + 'P'){
                    this.en_pasant = true;
                }
            }
            if(p.castle && p.castle == true){
                var rook_x;
                var rook_tile = document.getElementById(p.y + ',' + (p.x - p.delx));  
                switch(p.delx){
                    case -1: rook_x = 0; break;
                    default: rook_x = 7; break;
                }
                switch(this.color){
                    case "B":
                        for(const b of black_pieces){
                            if(b.x == rook_x && b.y == p.y){
                                rook_tile.appendChild(b.img);
                                b.x = p.x - p.delx;
                                b.img.setAttribute("id", b.y +',' +b.x + ',img')
                            }
                        } 
                        break;
                    default:
                        for(const w of white_pieces){
                            if(w.x == rook_x && w.y == p.y){
                                rook_tile.appendChild(w.img);
                                w.x = p.x - p.delx;
                                w.img.setAttribute("id", w.y + ',' + w.x + ',img')
                            }
                        } 
                        break;
                }
                //Handle Castling
                socket.emit("UpdateMovement", {
                    x: rook_x,
                    y: p.y,
                    xi: p.x - p.delx,
                    yi: p.y
                });
            }
            /**
             * Reinitializing 
             * new pieces
             */
            this.pawn_init = false;
            this.castle_enable = false;
            new_tile.appendChild(this.img);
            //Transmit mvt data
            socket.emit("UpdateMovement", {
                 x: this.x, 
                 y: this.y, 
                 xi: p.x, 
                 yi: p.y, 
                 ep: this.en_pasant})
            this.y = p.y;
            this.x = p.x;
            this.img.setAttribute("id", this.y + ',' + this.x + ',img');
            this.img.setAttribute("enpasant", this.en_pasant);
            this.img.setAttribute("castle", this.castle_enable)
            this.img.style.background = "none";
            current_turn = current_turn == turn.black ? turn.white : turn.black;
            ResetMoves();
            ResetCurrentPlayersPawns(); //For en pasant
            console.log(current_turn);
            if(this.AddMove(p)){
                current_turn = current_turn == turn.white ? turn.black_winner : turn.white_winner;
                Winner();
            }
            //Data Transmission
            //Transmit Turn Data
            socket.emit("TurnData", (current_turn));
            //Keep Move history constantly looking at the bottom
            MoveHistory.scrollTop = MoveHistory.scrollHeight;
        });
        next.appendChild(next_tile);
    }
    CaptureEventListener(p){
        var tile = document.getElementById(p.y + ',' + p.x + ',img');
        var background = document.getElementById(p.y + ',' + p.x);
        background.style.background = "cyan";
        //safe guard
        if(tile == null) return;
        //safe guard
        tile.addEventListener("click", ()=>{
            if(this.type == "pawn" && (p.y == 0 || p.y == 7)) {
                EnablePromote(p, this, current_turn);
                current_turn = turn.none;
                return;
            }
            var enemy_color = this.color == "W" ? "black" : "white";
            var tile = CapturePiece(enemy_color, p.x, p.y);
            var prev = { x: this.x, y: this.y, xi: p.x, yi: p.y, ep: this.en_pasant, ep_cap: -1}
            if(p.ep){ //For en pasant
                tile = document.getElementById((p.y + this.direction) + ',' + p.x);
                prev.ep_cap = p.y;
                console.log(prev.ep_cap);
                prev.yi += this.direction;
                this.y = p.y + this.direction;
            }
            else{
                tile = document.getElementById(p.y + ',' + p.x);
                this.y = p.y;
            }
            this.x = p.x;
            this.img.setAttribute("id", this.y + ',' + this.x + ',img');
            tile.appendChild(this.img);
            current_turn = current_turn == turn.black ? turn.white : turn.black;
            this.castle_enable = false;
            ResetMoves();
            ResetCurrentPlayersPawns(); //For en pasant
            console.log(current_turn);
            if(this.AddMove(prev,true)){
                current_turn = current_turn == turn.black ? turn.white_winner : turn.black_winner;
                Winner();
            }
            socket.emit("UpdateMovement", prev);
            socket.emit("TurnData", (current_turn));
            //Keep Move history constantly looking at the bottom
            MoveHistory.scrollTop = MoveHistory.scrollHeight;
        })
    }
}