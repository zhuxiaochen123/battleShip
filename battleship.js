var view = {
  displayMessage: function(msg) {  //displayMessage是一个方法
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
 
  },
  displayHit: function(location) { //location为td元素的id
    var cell = document.getElementById(location);
    cell.setAttribute("class","hit");//增加指定的属性，并为它赋指定的值 
     //hit为特性
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class","miss");
 
  }
};
//view.displayMiss("00");
//view.displayHit("34");
//view.displayMiss("55");
//view.displayHit("12");
//view.displayMiss("25");
//view.displayHit("26");
//view.displayMessage("Tap tap,is this thing on?");
 
var model = {
  boardSize: 7, //网格大小
  numShips: 3,  //战舰数
  shipLength: 3,//战舰所处位置及被击中的部位
  shipsSunk: 0, //有多少战舰被击沉
   
  ships: [
    {locations: [0,0,0],hits:["","",""]}, //locations存储了战舰占据的单元格
    {locations: [0,0,0],hits:["","",""]},//hits指出战舰是否被击中
    {locations: [0,0,0],hits:["","",""]}],
   
     
   
  fire: function(guess){
    for(var i = 0; i<this.numShips; i++){
      var ship = this.ships[i];//获取一个战舰
      var index = ship.locations.indexOf(guess);// indexOf  为数组中的   guess作为索引 没有找到值就返回-1
      if (index >=0){ //返回的值>=0说明玩家集中了战舰
          ship.hits[index] = "hit";//将hits中的相应元素设置为“hit”
          view.displayHit(guess); //是否击中了战舰
          view.displayMessage("HIT!");//显示集中了战舰
          if (this.isSunk(ship)) {//判断战舰是否被击中
            view.displayMessage("You sank my battleship!");
            this.shipsSunk++;
            var qwer = this.numShips-this.shipsSunk;
            document.getElementById("numships").innerHTML=("还剩的战舰数:"+qwer);
          }
          return true;
           
      }
    }
    view.displayMiss(guess);//没有击中战舰
    view.displayMessage("You missed.");
    return false;
  },
 
  isSunk: function(ship) {
    for (var i = 0; i<this.shipLength; i++){
      if (ship.hits[i] !=="hit"){ //当i>3是返回true
        return false;
      }
    }
    return true;
  },
  generateShipLocations: function(){ //每次都创建一个新战舰直到在ships创建了足够的战舰为止
    var locations;
    for (var i=0; i<this.numShips; i++){
       do{
         locations = this.generateShip();//生成战舰占据的位置
       }while (this.collision(locations));//判断战舰是否有重叠 如果重叠了就再次尝试
       this.ships[i].locations = locations;//生成可行的战舰后把它赋值给model.ships中locations属性
    }
  },
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);// floor()用来取整  manth.random返回0到1之间的随机数
    var row, col;
 
    if (direction ===1) {
      row = Math.floor(Math.random()* this.boardSize);
      col = Math.floor(Math.random()*(this.boardSize - this.shipLength));
    }else {
      row = Math.floor(Math.random()*(this.boardSize - this.shipLength));
      col = Math.floor(Math.random()* this.boardSize);
    }
     
    var newShipLocations = [];
    for (var i = 0 ; i<this.shipLength; i++) {
      if (direction === 1){
        newShipLocations.push(row + ""+(col+i));//用于生成水平的战舰
      }else {
        newShipLocations.push((row + i)+""+col);//用于生成竖直的战舰
      }
    }
    return newShipLocations;//返回给这个数组
  },
  collision: function(locations) {//用于判断战舰是否发生碰撞
    for (var i =0; i<this.numShips; i++){//i为战舰的数量
      var ship = model.ships[i];
      for (var j=0; j< locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >=0) {
          return true;//返回>=0及发生了碰撞
        }
      }
    }
    return false;//没有发生碰撞
  }  
};
function parseGuess(guess){
  var alphabet = ["A","B","C","D","E","F","G"];
  if (guess === null || guess.length !== 2){
    alert("Oops,please enter a letter and a number on the board.");//提醒玩家要输入数值 A10则这样提醒
  }else{
    firstChar = guess.charAt(0);//第一个字符
    var row = alphabet.indexOf(firstChar);//获取0到6的数字即为A B C
    var column = guess.charAt(1);//第二个字符 
 
    if (isNaN(row) || isNaN(column)) { //isNaN() 函数用于检查其参数是否是非数字值
      alert("Oops, that isn't on the board.");
    }else if (row<0 || row>= model.boardSize || column <0 ||column>=model.boardSize){
      alert ("Oops, that's off the board!");//如A8
    }else{
      return row+column;//都有效就返回 如A0
    }
  }
  return null; //如A7
}
//console.log(parseGuess("A0"));
//console.log(parseGuess("G3"));
var controller = {
  guesses: 0,
  processGuess: function(guess) {//判断玩家用了多少次结束了游戏
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;//次数+1
      document.getElementById("guess").innerHTML="猜测次数:"+this.guesses;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {//如果击沉了3个战舰就返回下面的东西
        view.displayMessage("You sank all my battleships, in "+this.guesses+"guesses");
      }
      //返回值不是null即为有效
    }
  }
};
//controller.processGuess("A0");
function init() {
  var fireButton = document.getElementById("fireButton");//获取html中的id
  fireButton.onclick = handleFireButton;//增加单机事件处理程序 让它获得handleFireButton的功能
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;//按键事件
 
  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;//将猜测存储在value中
  controller.processGuess(guess);//猜测如A0
 
  guessInput.value = "";//删除前面的猜测
}
 
function handleKeyPress(e) {//按下回车=单机fire
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
       fireButton.click();
       return false;
  }
}

 
window.onload = init;

