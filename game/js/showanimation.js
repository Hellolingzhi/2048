var rem = 50;

function showNumberWithAnimation(x, y, num) {
    var cell = $("#num-cell-" + x + "-" + y);
    //注意非数字属性不能使用动画效果，要单独写css样式，而不能通过animate加上颜色的css样式
    cell.css({
        "color": getColor(num),
        "backgroundColor": getBackgroundColor(num)
    });
    cell.text(num);
    cell.stop().animate({
        left: getLeftPos(x, y) + 'px',
        top: getTopPos(x, y) + 'px',
        width: 2 * rem,
        height: 2 * rem
    }, 50);
}

function showMoveAnimation(fromx,fromy,tox,toy) {
    var cell = $("#num-cell-"+fromx+"-"+fromy);
    cell.stop().animate({
        top: getTopPos(tox,toy),
        left: getLeftPos(tox,toy)
    },200);
}

// 显示分数
function updateScore(score) {
    $("#score").text(score);
}