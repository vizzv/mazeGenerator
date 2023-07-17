var cols, rows;
var w = 30;
var grid = [];
var isDownloadable=true;
var current;
var button;

var stack = [];

function setup() {
  createCanvas(700, 700);
  cols = floor(width / w);
  rows = floor(height / w);
  //frameRate(5);

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[0];
  button= createButton('download');
  button.mousePressed(akFunction);
  button.style("visibility","hidden")

}
function akFunction(){
    let canvas = document.getElementById("defaultCanvas0");
    
    // (B2) CREATE LINK
   let anchor = document.createElement("a");
   anchor.download = "download.png";
   anchor.href = canvas.toDataURL("image/png");
  
   // (B3) "FORCE DOWNLOAD"
   anchor.click();
   anchor.remove();
}

function draw() {
  background(0);
  
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  
  // STEP 1
  var next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    // STEP 2
    stack.push(current);

    // STEP 3
    removeWalls(current, next);

    // STEP 4
    current = next;
  }
   
  else if (stack.length > 0) {
    current = stack.pop();
  }
  else if(stack.length==0){
    button.style("visibility","visible")
  }
  

}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}


function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
  
    this.checkNeighbors = function() {
      var neighbors = [];
  
      var top = grid[index(i, j - 1)];
      var right = grid[index(i + 1, j)];
      var bottom = grid[index(i, j + 1)];
      var left = grid[index(i - 1, j)];
  
      if (top && !top.visited) {
        neighbors.push(top);
      }
      if (right && !right.visited) {
        neighbors.push(right);
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom);
      }
      if (left && !left.visited) {
        neighbors.push(left);
      }
  
      if (neighbors.length > 0) {
        var r = floor(random(0, neighbors.length));
        return neighbors[r];
      } else {
        return undefined;
      }
  
  
    }
    this.highlight = function() {
      var x = this.i * w;
      var y = this.j * w;
      noStroke();
      fill(0, 0, 255, 100);
      rect(x, y, w, w);
  
    }
    this.unhilight = function() {
        var x = this.i * w;
        var y = this.j * w;
        noStroke();
        fill(255, 0, 255, 100);
        rect(x, y, w, w);
    
      }
    this.getRandom=function(){
        return floor(random(0,255));
    }
    this.show = function() {
      var x = this.i * w;
      var y = this.j * w;
      stroke(255);
      if (this.walls[0]) {
        line(x, y, x + w, y);
      }
      if (this.walls[1]) {
        line(x + w, y, x + w, y + w);
      }
      if (this.walls[2]) {
        line(x + w, y + w, x, y + w);
      }
      if (this.walls[3]) {
        line(x, y + w, x, y);
      }
  
      if (this.visited) {
        noStroke();
        
        fill(0, 255, 20, 80);
        rect(x, y, w, w);
      }
    }
  }