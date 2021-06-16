function GameCodeGenerator(){
    var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = "";
    for(var a = 0; a < 5; a++){
        var sel = Math.floor(Math.random() * characters.length);
        result += characters[sel];
    }
    return result;
}