function PawnChecking(x, y, direction,enemy){
    var dir = [-1,1];
    var result = false;
    for(var a = 0; a < 2; a++){
        var tile = document.getElementById((y+direction) + ',' + (x+dir[a]));
        if(tile && tile.firstChild){
            var src = tile.firstChild.getAttribute("src");
            if(src && src[7] == enemy && src[8] == "K" && src[9] != "n")
                result =  true;
            else 
                result =  false;
        }
    }
    return result;
}

function DiagonalChecking(x,y,enemy){
    var dirx = [-1,-1,1,1]
    var diry = [1,-1,1,-1]
    var result = false;
    for(var i = 0; i < 4; i++){
        for(var a = x+dirx[i], b = y+diry[i]; a > -1 && b > -1 && a < 8 && b < 8; a+= dirx[i], b += diry[i]){
            var tile = document.getElementById(b + ',' + a);
            if(tile && tile.firstChild){
                var src = tile.firstChild.getAttribute("src");
                if(src && src[7] == enemy && src[8] == "K" && src[9] != "n"){
                    result =  true; //indicate we are checking
                }
                break;
            }
        }
    }
    return result;
}

function LateralChecking(x, y, enemy, highlight){
    var dirx = [-1,0,1,0]
    var diry = [0,1,0,-1]
    var result = false;
    for(var i = 0; i < 4; i++){
        for(var a = x+dirx[i], b = y+diry[i]; a > -1 && b > -1 && a < 8 && b < 8; a+= dirx[i], b += diry[i]){
            var tile = document.getElementById(b + ',' + a);
            if(tile && tile.firstChild){
                if(highlight)
                    tile.style.background = "green"
                var src = tile.firstChild.getAttribute("src");
                if(src && src[7] == enemy && src[8] == "K" && src[9] != "n"){
                    result =  true; //indicate we are checking
                }
                break;
            }
        }
    }
    return result;
}

function KnightChecking(x,y, enemy){
    var dy = [-2,-2,-1,1,2, 2, 1,-1];
    var dx = [-1, 1, 2,2,1,-1,-2,-2];
    var result = false;
    for(var a  = 0; a < 8; a++){
        var tile = document.getElementById((y + dy[a]) + ',' + (x + dx[a]));
        if(tile != null && tile.firstChild != null){
            var src = tile.firstChild.getAttribute("src");
            if(src && src[7] == enemy && src[8] == "K" && src[9] != "n"){
                result = true;
            }
        }
    }
    return result;
}

function KingChecking(x,y,enemy){
    var delx = [-1, 0, 1,1,1,0,-1,-1];
    var dely = [-1,-1,-1,0,1,1,1,0];
    for(var a = 0; a < 8; a++){
        var tile = document.getElementById((y + dely[a]) + ',' + (x + delx[a]))
        if(tile != null && tile.firstChild != null){
            var src = tile.getAttribute("src");
            if(src && src[7] == enemy && src[8] == "K" && src[9] != "n")
                return true;
            else 
                return false;
        }
    }
    return false;
}