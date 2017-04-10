

var UNOCCUPIED = '-';
var print = function (myPlates) {
            var s = [];
            for (var i = 0; i < 9; i ++) {
                for (var j = 0; j < 9; j ++) {
                    if (i === 0 || i === 4 || i === 8) {
                        s.push('*');
                    } else if (j === 0 || j === 4 || j === 8) {
                        s.push('*');
                    } else {
                        if (j > 0 && j < 4) {
                            if (i < 4) {
                                s.push(myPlates[0][i-1][j-1]);
                            } else {
                                s.push(myPlates[2][i-5][j-1]);
                            }
                        } else {
                            if (i < 4) {
                               s.push(myPlates[1][i-1][j-5]);
                            } else {
                                s.push(myPlates[3][i-5][j-5]);
                            }
                        }
                    }
                }
                s.push('\n');
            }
            return s.join("");;    
};



function testArray() {
    this.theArray = createArray();
    function createArray() {
        var allPlates = []
        for (var i = 0; i < 4; i ++) {//4 plates
            allPlates[i] = [];
            for (var j = 0; j < 3; j ++) {//3 rows
                allPlates[i][j] = [];
                for (var k =0; k < 3; k ++) {//3 cols
                    allPlates[i][j][k] = UNOCCUPIED;
                }
            }
        }
        document.getElementById("debug").innerHTML = UNOCCUPIED;
        return allPlates;
    }
     this.setPlates = function (input) {
            debugOut(input.myPlates);
             for (var k = 0; k < 4; k ++) {
                for (var i = 0; i < 3; i ++) {
                    for (var j = 0; j < 3; j ++) {
                        this.theArray[k][i][j] = input.theArray[k][i][j];
                    }
                }
            }
        }
};
function debugOut (temp) {
    var para = document.createElement("p");
                            var node = document.createTextNode(temp);
                            para.appendChild(node);
                             var element = document.getElementById("response");
                            var child = document.getElementById("debug");
                            element.insertBefore(para,child);
};
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
};



function choose() {
    var a = new testArray();
    printObject(a);
    var len = "";
    for (var i = 0; i < 4; i ++) {//4 plates
            for (var j = 0; j < 3; j ++) {//3 rows
                for (var k =0; k < 3; k ++) {//3 cols
                    a.theArray[i][j][k] = k;
                }
            }
        };
    debugOut(print(a.theArray));
    var b = new testArray();
    b.setPlates(a);
    debugOut(print(b.theArray));
};

