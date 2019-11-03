var rem = 50;

function getTopPos(i, j) {
    // console.log(i * 2.4 * rem + 0.4 * rem);
    return i * 2.4 * rem + 0.4 * rem;
}

function getLeftPos(i, j) {
    // console.log(j * 2.4 * rem + 0.4 * rem);
    return j * 2.4 * rem + 0.4 * rem;
}

function getBackgroundColor(num) {
    switch (num) {
        case 2:
            return "#ECAAB6";
            break;
        case 4:
            return "#EFC3A0";
            break;
        case 8:
            return "#F9F6B1";
            break;
        case 16:
            return "#D5E6AF";
            break;
        case 32:
            return "#B8B1D2";
            break;
        case 64:
            return "#D0A3C4";
            break;
        case 128:
            return "#BFDAB9";
            break;
        case 256:
            return "#99C789";
            break;
        case 512:
            return "#71B47E";
            break;
        case 1024:
            return "#BDBD29";
            break;
        case 2048:
            return "#8F922B";
            break;
        case 4096:
            return "#B4719B";
            break;
        case 8129:
            return "#815D96";
            break;
    }
    // return "#000";
}

function getColor(num) {
    if (num <= 4) {
        return "#776e65";
    }
    return "white";
}

function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                return false;
            }
        }
    }
    return true;
}

function noBlockY(k,i,j,board) {
    for(var t = k+1;t<i;t++){
        if (board[t][j]!==0) {
            return false;
        }
    }
    return true;
}

function noBlockX(i,j,k,board) {
    for(var t = j+1;t<k;t++) {
        if (board[i][t]!==0) {
            return false;
        }
    }
    return true;
}