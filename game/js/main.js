var score = 0;
//用一个二维数组存放每隔小格子的数字
var board = [];

var rem = 50;

//用一个二维数组存放每隔小格子是否已经合并过
var hasconflicte = [];

$(function () {
    //游戏开始
    newgame();

    //响应动作
    $(document).on({

        "keydown": function(e){
            e.preventDefault();
            switch(e.keyCode){
                
                //移动成功时，随机生成一个数，然后判断游戏是否结束
                case 37:if(moveLeft()){
                        setTimeout("generateOneNumber()",230);
                        setTimeout("isGameOver()",2000);
                    }
                break;
                
                //移动成功时，随机生成一个数，然后判断游戏是否结束
                case 38:if(moveUp()){
                        setTimeout("generateOneNumber()",230);
                        setTimeout("isGameOver()",2000);
                        }
                break;
        
                 
                //移动成功时，随机生成一个数，然后判断游戏是否结束
                case 39:if(moveRight()){
                        setTimeout("generateOneNumber()",230);
                        setTimeout("isGameOver()",2000);
                    }
                break;
                 
                //移动成功时，随机生成一个数，然后判断游戏是否结束
                case 40:if(moveDown()){
                        setTimeout("generateOneNumber()",230);
                        setTimeout("isGameOver()",2000);
                    }
                break;
                
            }
            return 0;
        }

    });

});


function newgame() {
    //初始化
    init();

    // 随机产生两个数
    generateOneNumber();
    generateOneNumber();
}

//初始化函数
function init() {
    //分数初始化为0
    score = 0;
    //初始化二维数组board全为0
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasconflicte[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasconflicte[i][j]=false;
        }
    }

    // 绝对定位确定grid-cell位置
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var the_grid_cell = $("#grid-cell-" + i + "-" + j);
            // console.log(the_grid_cell.attr("id"));
            // 函数调用返回位置
            the_grid_cell.css({
                top: getTopPos(i, j) + 'px',
                left: getLeftPos(i, j) + 'px'
            });
            // console.log(getTopPos(i, j));
            // console.log(getLeftPos(i, j));

        }
    }

    // 动态生成num-cell
    updateBoardView();

}

// 动态生成num-cell根据值来选择是否显示w、 h = 0就是不显示
function updateBoardView() {
    // 重新生成前清除以前的
    $(".num-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append("<div class='num-cell' id='num-cell-" + i + "-" + j + "'></div>");
            var the_num_cell = $("#num-cell-" + i + "-" + j);
            if (board[i][j] === 0) {
                // 为0就宽高为0不显示
                the_num_cell.css({
                    width: 0,
                    height: 0
                });
            } else {
                the_num_cell.css({
                    width: 2 * rem,
                    height: 2 * rem,
                    //根据不同数值不同背景色和字体色
                    "color": getColor(board[i][j]),
                    "background-color": getBackgroundColor(board[i][j])
                });
                //设置文本值
                the_num_cell.text(board[i][j]);

            }
            // 确定绝对定位位置
            the_num_cell.css({
                left: getLeftPos(i, j),
                top: getTopPos(i, j)
            });

            //每次渲染清空hasconflicte里的数
            hasconflicte[i][j] = false;
        }
    }
}



// 随机产生数字
function generateOneNumber() {
    //随机位置
    // 判断有无空位置
    if (nospace(board)) {
        return false;
    }
    //ramdom()随机产生0~1的浮点数，要扩大，向下约，转为整数
    var x = parseInt(Math.floor(Math.random() * 4));
    var y = parseInt(Math.floor(Math.random() * 4));
    //times 记录随机次数，达到一定次数还没随机到空位就指定空位
    var times = 0;
    while (times < 50) {
        if (board[x][y] === 0) {
            break;
        }
        x = parseInt(Math.floor(Math.random() * 4));
        y = parseInt(Math.floor(Math.random() * 4));
    }
    if (times === 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    x = i;
                    y = j;
                }
            }
        }
    }
    // 随机产生2 或者 4 
    var num = Math.random() < 0.5 ? 2 : 4;
    board[x][y] = num;

    // 将新产生的值显示在页面上
    showNumberWithAnimation(x, y, num);
    return true;
}


// 移动的时候，向哪个方向移动，哪个方向的最后一行/列不用判断能否移动以及移动到的位置
// 循环判断的时候 向右向下移动需要逆序循环
// 比如向下移动就要从倒数第二行向第一行循环找非零数据
// 找到非零数据后判断这个数据应该的移动位置就要从最后一行向这个数据的下一行循环找位置，一旦找到，这个位置必定是这时候可以移动的最远位置，直接break跳出循环，开始判断下一个非零数据

//向上移动的情况：有数字的格子的上面有空位并且中间没有阻碍或者与上面数字相同并且中间没有阻碍可以合并
//noBlockY(k,i,j,board) 判段k行j列和i行j列间有无阻碍
function moveUp(){
    //通过flag判断是否移动成功
    var flag = false;
    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){

            if (board[i][j]!== 0) {
                for (var k = 0;k<i;k++){
                    //落脚处为0
                    if (board[k][j]===0&&noBlockY(k,i,j,board)) {
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        flag = true;
                        //移动动画 从i,j 移动到 k,j
                        //先变换里面数据再将num-cell-i-j使用动画移动到k-j位置，
                        showMoveAnimation(i,j,k,j);
                        break;
                    }else if (board[k][j]===board[i][j]&&noBlockY(k,i,j,board)) {
                    //落脚处数值等于将要移动的格子的数值
                        if (!hasconflicte[k][j]) {
                            // 若落脚处数值为经过合并
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            score += board[k][j];
                            hasconflicte[k][j] = true;
                            updateScore(score);
                            showMoveAnimation(i,j,k,j);
                        }else{
                            board[k+1][j] = board[i][j];
                            board[i][j]=0;
                            showMoveAnimation(i,j,k+1,j);
                        }
                        flag = true;
                        break;
                    }
                }
            }

        }
    }
    //修改完二维数组中的数字后要重新渲染生成num-cell
    //为了让移动动画显示完再渲染，使用定时器setTimeout
    setTimeout("updateBoardView()",250);
    console.log(board);

    return flag;

}

//向下移动的情况：有数字的格子的下面有空位并且中间没有阻碍或者与下面数字相同并且中间没有阻碍可以合并
//noBlockY(k,i,j,board) 判段k行j列和i行j列间有无阻碍
function moveDown(){
    //通过flag判断是否移动成功
    var flag = false;
    for(var i=2;i>=0;i--){
    // 注意，向下运动的行应该从最下边向上循环判断
        for(var j=0;j<4;j++){
            if (board[i][j]!== 0) {
                for (var k = 3;k>i;k--){
                    if (board[k][j]===0&&noBlockY(i,k,j,board)) {
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        flag = true;
                        //移动动画 从i,j 移动到 k,j
                        //变换里面数据再将num-cell-i-j使用动画移动到k-j位置
                        showMoveAnimation(i,j,k,j);
                        break;
                    }else if (board[k][j]===board[i][j]&&noBlockY(i,k,j,board)) {
                        if (!hasconflicte[k][j]) {
                            // 若落脚处数值为经过合并
                            board[k][j]+=board[i][j];
                            board[i][j]=0;
                            score += board[k][j];
                            hasconflicte[k][j] = true;
                            updateScore(score);
                            showMoveAnimation(i,j,k,j);
                        }else{
                            board[k-1][j] = board[i][j];
                            board[i][j]=0;
                            showMoveAnimation(i,j,k-1,j);
                        }
                        flag = true;
                        break;
                    }
                }

            }

        }
    }
    //修改完二维数组中的数字后要重新渲染生成num-cell
    //为了让移动动画显示完再渲染，使用定时器setTimeout
    setTimeout("updateBoardView()",250);
    console.log(board);

    return flag;

}

//向右移动的情况：有数字的格子的右面有空位并且中间没有阻碍或者与右面数字相同并且中间没有阻碍可以合并
//noBlockY(k,i,j,board) 判段i行k列和i行j列间有无阻碍
function moveRight(){
    //通过flag判断是否移动成功
    var flag = false;
    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            // 注意，向右运动的列应该从最右边向左循环判断
            if (board[i][j]!== 0) {
                for (var k = 3;k>j;k--){
                    if (board[i][k]===0&&noBlockX(i,j,k,board)) {
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        flag = true;
                        showMoveAnimation(i,j,i,k);
                        break;
                    }else if (board[i][k]===board[i][j]&&noBlockX(i,j,k,board)) {
                       if (!hasconflicte[i][k]) {
                            // 若落脚处数值为经过合并
                            board[i][k]+=board[i][j];
                            board[i][j]=0;
                            score += board[i][k];
                            hasconflicte[i][k] = true;
                            updateScore(score);
                            showMoveAnimation(i,j,i,k);
                        }else{
                            board[i][k-1] = board[i][j];
                            board[i][j]=0;
                            showMoveAnimation(i,j,i,k-1);
                        }
                        flag = true;
                        break;
                    }
                }
            }

        }
    }
    //修改完二维数组中的数字后要重新渲染生成num-cell
    //为了让移动动画显示完再渲染，使用定时器setTimeout
    setTimeout("updateBoardView()",250);
    return flag;

}

//向左移动的情况：有数字的格子的左面有空位并且中间没有阻碍或者与右面数字相同并且中间没有阻碍可以合并
//noBlockY(k,i,j,board) 判段i行k列和i行j列间有无阻碍
function moveLeft(){
    //通过flag判断是否移动成功
    var flag = false;
    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){

            if (board[i][j]!== 0) {
                for (var k = 0;k<j;k++){
                    if (board[i][k]===0&&noBlockX(i,k,j,board)) {
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        flag = true;
                        showMoveAnimation(i,j,i,k);
                        break;
                    }else if (board[i][k]===board[i][j]&&noBlockX(i,k,j,board)) {
                        if (!hasconflicte[i][k]) {
                            // 若落脚处数值为经过合并
                            board[i][k]+=board[i][j];
                            board[i][j]=0;
                            score += board[i][k];
                            hasconflicte[i][k] = true;
                            updateScore(score);
                            showMoveAnimation(i,j,i,k);
                        }else{
                            board[i][k+1] = board[i][j];
                            board[i][j]=0;
                            showMoveAnimation(i,j,i,k+1);
                        }
                        flag = true;
                        break;
                    }
                }
            }

        }
    }
    //修改完二维数组中的数字后要重新渲染生成num-cell
    //为了让移动动画显示完再渲染，使用定时器setTimeout
    setTimeout("updateBoardView()",250);
    return flag;

}

function isGameOver(){
    if (nospace(board)&&!(moveLeft()||moveRight()||moveDown()||moveUp())) {
        alert('game over');
    }
}