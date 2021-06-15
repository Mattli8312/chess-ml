class Pawn extends Piece{
    Initialize(){
        this.pawn_init = true;
        this.en_pasant = false;
        this.type = "pawn";
    }
    Move(){
        ResetMoves();
        for(var a = this.direction; a < 3 && a > -3; a += this.direction){
            var collided = document.getElementById(this.y+a + ',' + this.x)
            if(collided == null || collided.firstChild != null){
                break;
            }
            if(Math.abs(a) == 2 && !this.pawn_init)
                break
            if(LegalMove(this.x, this.y, this.x, this.y + a))
                potential_moves.push({
                    x: this.x,
                    y: this.y + a
                })
        }
        var delx = [1,-1];
        for(const d of delx){
            var enemy = document.getElementById((this.y + this.direction) + ',' + (this.x + d));
            //Traditional Capture
            if(enemy != null){
                if((enemy.firstChild != null && enemy.firstChild.getAttribute("src")[7] != this.color)){
                    if(LegalMove(this.x,this.y,this.x+d,this.y+this.direction)){
                        potential_attacks.push({
                            x: this.x + d,
                            y: this.y + this.direction,
                            ep: false
                        })
                    }
                }
                else{
                    enemy = document.getElementById((this.y) + ',' + (this.x + d));
                    if(enemy.firstChild != null && enemy.firstChild.getAttribute("enpasant") == "true"){
                        if(LegalMove(this.x,this.y,this.x + d,this.y))
                            potential_attacks.push({
                                x: this.x + d,
                                y: this.y,
                                ep: true
                            })
                    }
                }
            }
        }
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){ 
            this.CaptureEventListener(p);
        }
    }
}

class Rook extends Piece{
    Initialize(){
        this.type = "rook";
        this.castle_enable = true;
    }
    Move(){
        ResetMoves();
        MoveLaterally(this.x, this.y, this.color == "W" ? "B" : "W");
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){
            this.CaptureEventListener(p);
        }
    }
}

class Knight extends Piece{
    Initialize(){
        this.type = "knight";
    }
    Move(){
        ResetMoves();
        //Use 2 arrays for x and y displacements
        var dy = [-2,-2,-1,1,2, 2, 1,-1];
        var dx = [-1, 1, 2,2,1,-1,-2,-2];
        for(var a  = 0; a < 8; a++){
            var tile = document.getElementById((this.y + dy[a]) + ',' + (this.x + dx[a]));
            if(tile != null){
                if(!LegalMove(this.x, this.y, this.x + dx[a], this.y + dy[a]))
                    continue;
                if(tile.firstChild == null){
                    potential_moves.push({
                        x: this.x + dx[a],
                        y: this.y + dy[a]
                    })
                }
                else if(tile.firstChild.getAttribute("src")[7] != this.color){
                        potential_attacks.push({
                            x: this.x + dx[a],
                            y: this.y + dy[a],
                            ep: false
                        })
                }
            }
        }
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){
            this.CaptureEventListener(p);
        }
    }
}

class Bishop extends Piece{
    Initialize(){
        this.type = "bishop";
    }
    Move(){
        ResetMoves();
        MoveDiagonally(this.x, this.y,this.color == "W" ? "B" : "W");
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){
            this.CaptureEventListener(p);
        }
    }
}

class Queen extends Piece{
    Initialize(){
        this.type = "queen";
    }
    Move(){
        ResetMoves();
        MoveDiagonally(this.x, this.y, this.color == "W" ? "B" : "W");
        MoveLaterally(this.x, this.y, this.color == "W" ? "B" : "W");
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){
            this.CaptureEventListener(p);
        }
    }
}

class King extends Piece{
    Initialize(){
        this.type = "king";
        this.castle_enable = true;
    }
    Move(){
        ResetMoves();
        //Traditional Moves
        var delx = [-1, 0, 1,1,1,0,-1,-1];
        var dely = [-1,-1,-1,0,1,1,1,0];
        for(var a = 0; a < 8; a++){
            var check = document.getElementById((this.y + dely[a]) + ',' + (this.x + delx[a]))
            if(check != null){
                var tile = document.getElementById((this.y + dely[a]) + ',' + (this.x + delx[a]) + ',img');
                if(!LegalMove(this.x,this.y,this.x+delx[a],this.y+dely[a])){
                    continue;
                }
                if(tile == null){
                    potential_moves.push({
                        x: this.x + delx[a],
                        y: this.y + dely[a]
                    })
                }
                else if(tile != null && tile.getAttribute("src")[7] != this.color){
                    potential_attacks.push({
                        x: this.x + delx[a],
                        y: this.y + dely[a],
                        ep: false
                    })
                }
            }
        }
        //Castling
        if(this.castle_enable){
            var dir = [-1,1];
            for(var a = 0; a < 2; a++){
                for(var b = this.x + dir[a]; b > -1 && b < 8; b+= dir[a]){
                    var tile = document.getElementById(this.y + ',' + b);
                    if(tile != null && tile.firstChild != null){
                        var castle = tile.firstChild.getAttribute("castle");
                        if(castle == "true" && LegalMove(this.x, this.y, this.x+dir[a], this.y) && LegalMove(this.x, this.y, this.x+(dir[a] *2), this.y)){
                            //Then we can castle
                            potential_moves.push(
                                {
                                    x: this.x + (dir[a] * 2),
                                    y: this.y,
                                    delx: dir[a],
                                    castle: true
                                }
                            )
                        }
                        break;
                    }
                }
            }
        }
        for(const p of potential_moves){
            this.MoveEventListener(p);
        }
    }
    Capture(){
        for(const p of potential_attacks){
            this.CaptureEventListener(p);
        }
    }
}