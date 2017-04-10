var myBasics = new basics();
var playerChosen = 'b';
var playerAvail = ['b','w'];
var player = 'b';
SCORECASES = [0,0,1,10,100,100000000,100000000];
DEPTHLIMIT = 4;
var choose = function() {
        var bw = document.getElementsByName('black-white');
            for (var i = 0; i < bw.length; i ++) {
                if (bw[i].checked) {
                    if (bw[i].nextSibling.data === "Black") {
                        playerChosen = 'b'
                    } else {
                        playerChosen = 'w';
                    }
                    var newText = "You choose the " + bw[i].nextSibling.data + " stone! Let's start the game!'";
                    document.getElementById("textContent").innerHTML = newText;
                }
            }
            document.getElementById("platestring").innerHTML =  myBasics.toString();
    };

var playerStep = function() {
		var place = parseInt(document.getElementById("Place").value);
        var plate = parseInt(document.getElementById("Plate").value);
        var plater = parseInt(document.getElementById("Plater").value);
        var direction = document.getElementById("direction").value;
        if (isNaN(plate) || plate < 1 || plate > 4) {
            document.getElementById("Plate").value = "";
    		alert("Invalid input! Plate out of range (1-4) : " + plate);        
    	} else if (isNaN(place) || place < 1 || place > 9) {
            document.getElementById("Place").value = "";
    		alert("Invalid input! Place out of range (1-9)");
    	} else if (isNaN(plater) || plater < 1 || plater > 4) {
            document.getElementById("Plater").value = "";
    		alert("Invalid input! Plater out of range (1-4)");
    	} else if (direction != 'l' && direction != 'r') {
            document.getElementById("direction").value = "";
    		alert("Invalid input! Dir out of range (l&r)");
    	} else {
            place = place - 1;
            plate = plate - 1;
            plater = plater - 1;
            document.getElementById("responseline").innerHTML = ("place = " + 
                    place + " plate = " + plate + "player = " + player + "plater = " + plater + "direction = " + direction);
            var pass = myBasics.place(place, plate, player);
            if (!pass) {
                document.getElementById("responseline").innerHTML = ("Error put: plate " + plate + " place " + place + " is already occupied!");
                return null;
            }
            var heuristicUpdate = new Heuristic(myBasics);
            if (heuristicUpdate.result > SCORECASES[5]/10) {
                alert("b win");
                myBasics = new basics();
                player = 'b';
            } else if (heuristicUpdate.result < -SCORECASES[5]/10) {
                alert ("w win");
                myBasics = new basics();
            }
            myBasics.rotate(plater, direction);
            heuristicUpdate = new Heuristic(myBasics);
            if (heuristicUpdate.result > SCORECASES[5]/10) {
                alert("b win");
                myBasics = new basics();
                player = 'b';
            } else if (heuristicUpdate.result < -SCORECASES[5]/10){
                alert ("w win");
                myBasics = new basics();
            }
            document.getElementById("platestring").innerHTML = myBasics.toString();
            changePlayer();
            
            document.getElementById("direction").value = "";
            document.getElementById("Plater").value = "";
            document.getElementById("Place").value = "";
            document.getElementById("Plate").value = "";
            document.getElementById("debug").innerHTML = ("player: " + player);
            var ai = new minimax(myBasics,player);
            ai.Result();
        }
       
	}

function changePlayer() {
		if (player == 'b') {
    		player = 'w';
    	} else {
    		player = 'b';
    	}
	}

function basics () {
     /**
     * unoccupied place
     */
    this.UNOCCUPIED = '_';
    /**
	 * the array contains 4 plates for the pentago
	 */
	this.myPlates = createPlate();
	/**
	 * int showing misplace
	 */
	this.PUTERROR = -10;
	/**
	 * int showing misrotate
	 */
	this.ROTERROR = -20;
    /**
     * the number of steps on the board
     */
	this.myStepCount = 0;

    /**
     * the recording heuristic of this node
     */
    this.myHeuristic = 0;
    /**
     * the array to record the children of this node if necessary
     */
    this.myChildren = [];
    /**
     * initialize plates
     */
    
    function createPlate() {
        
        var allPlates = []
        for (var i = 0; i < 4; i ++) {//4 plates
            allPlates[i] = [];
            for (var j = 0; j < 3; j ++) {//3 rows
                allPlates[i][j] = [];
                for (var k =0; k < 3; k ++) {//3 cols
                    allPlates[i][j][k] = this.UNOCCUPIED;
                }
            }
        }
        document.getElementById("debug").innerHTML = this.UNOCCUPIED;
        return allPlates;
    };
    /**
	 * method to put
	 * @param place place to put
	 * @param plate plate to put
	 * @param player player char
	 * @return if the move is right
	 */
	this.place = function(place, plate, player) {
		var i = Math.floor(place / 3);
		var j = place % 3;
		if (this.myPlates[plate][i][j] === this.UNOCCUPIED) {
			this.myPlates[plate][i][j] = player;
			this.myStepCount ++;
			return true;
		} else {
			return false;
		}
	};

	/**
	 * Method to rotate
	 * @param plater plate to rotate
	 * @param direction direction to rotate
	 * @return if the move is right
	 */
    this.rotate = function(plater, direction) {
            if (plater > -1 && plater < 4) {
                var rotated = [];
                var current = this.myPlates[plater];
                for (var i = 0; i < 3; i ++) {
                    rotated[i] = [];
                }
                //		right turn
                //		123     741    11 => 13, 12 => 23, 13 => 33
                //		456  => 852    21 => 12, 22 => 22, 23 => 32
                //		789     963    31 => 11, 32 => 21, 33 => 31
                if (direction == 'R' || direction == 'r') {
                    rotated [0][2] = current [0][0];
                    rotated [1][2] = current [0][1];
                    rotated [2][2] = current [0][2];
                    rotated [0][1] = current [1][0];
                    rotated [2][1] = current [1][2];
                    rotated [0][0] = current [2][0];
                    rotated [1][0] = current [2][1];
                    rotated [2][0] = current [2][2];
                    rotated [1][1] = current [1][1];
                } else if (direction == 'L' || direction == 'l'){
                    //			left turn
                    //		123     369    11 => 31, 12 => 21, 13 => 11
                    //		456  => 258    21 => 32, 22 => 22, 23 => 12
                    //		789     147    31 => 33, 32 => 23, 33 => 13     
                    rotated [2][0] = current [0][0];
                    rotated [1][0] = current [0][1];
                    rotated [0][0] = current [0][2];
                    rotated [2][1] = current [1][0];
                    rotated [0][1] = current [1][2];
                    rotated [2][2] = current [2][0];
                    rotated [1][2] = current [2][1];
                    rotated [0][2] = current [2][2];
                    rotated [1][1] = current [1][1];
                } else {
                    document.getElementById("responseline").innerHTML = ("there is no such an action.");
                    return false;
                }
                for (var i = 0; i < 3; i ++) {
                    for (var j = 0; j < 3; j ++) {
                        myPlates[plater][i][j] = rotated[i][j];
                    }
                }
                document.getElementById("responseline").innerHTML = ("rotation Suceed! Plate " + plater + "dir: " + direction);
                return true;
            } else {
                document.getElementById("responseline").innerHTML = ("there is no such plate to rotate.");
                return false;
            }
            
        };
        this.setH = function (input) {
                myHeuristic = input;
            };
        this.getH = function () {
                return myHeuristic;
            };
        /**
         * method to clone current game state
         */
        this.clone = function(source) {
            var re = new basics();
            re.setPlates(source);
            debugOut("this");
            debugOut(this);
            re.stepCount = this.stepCount;
            debugOut("re");
            debugOut(re);
            return re;
        };
        /**
         * method to copy the plate from input to current plate
         */
        this.setPlates = function (input) {
            debugOut(input.myPlates);
             for (var k = 0; k < 4; k ++) {
                for (var i = 0; i < 3; i ++) {
                    for (var j = 0; j < 3; j ++) {
                        myPlates[k][i][j] = input.myPlates[k][i][j];
                    }
                }
            }
        }
        /**
        * helper method to get the current state of the game
        * @return 2d array represent the state
        */
        this.getState = function() {
            var state = [];
            for (var i = 0; i < 6; i ++) {
                state[i] = [];
                for (var j = 0; j < 6; j ++) {
                    if (j > -1 && j < 3) {
                        if (i < 3) {
                            state[i][j] = this.myPlates[0][i][j];
                        } else {
                            state[i][j] = this.myPlates[2][i-3][j];
                        }
                    } else {
                        if (i < 3) {
                            state[i][j] = this.myPlates[1][i][j-3];
                        } else {
                            state[i][j] = this.myPlates[3][i-3][j-3];
                        }
                    }
                }
            }
            return state;
        };
        /**
         * method to return the state of the board as a string
         */
        this.toString = function() {
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
                                s.push(this.myPlates[0][i-1][j-1]);
                            } else {
                                s.push(this.myPlates[2][i-5][j-1]);
                            }
                        } else {
                            if (i < 4) {
                               s.push(this.myPlates[1][i-1][j-5]);
                            } else {
                                s.push(this.myPlates[3][i-5][j-5]);
                            }
                        }
                    }
                }
                s.push('<br>');
            }
            return s.join("");;
	    };
    
    
};

function Heuristic (basic) {
    /**
     * count of black stone in rows, cols and diags
     */
    this.resultB = [];
    /**
     * count of white stone in rows, cols and diags 
     */
    this.resultW = [];
    /**
     * final result of the basic 
     */
    this.result = prepare();
    function prepare() {
        var current = basic.getState();
        for (var i = 0; i < 6; i ++) {
            checkcol(i, current);
            checkrow(i, current);
        }
        
        checkDiag(0, 0, current);
        checkDiag(0, 5, current);

        var reB = 0;
        var reW = 0;

        for (var i = 0; i < reB.length; i ++) {
            reB += SCORECASES[resultB[i]];
            reW += SCORECASES[resultW[i]];
        }
        return reB - reW;
    }

    /**
	 * heuristic value for 0/1/2/3/4/5/6 in a row
	 */
    
    function checkrow(rowIndex, state) {
            var countb = 0;
            var countw = 0;
            var tempb = [];
            var tempw = [];
            for (var j = 0; j < 6; j ++) {
                if (state[rowIndex][j] == 'b') {
                    countb ++;
                    tempw.push(countw);
                    countw =0;
                } else if (state[rowIndex][j] == 'w'){
                    countw ++;
                    tempb.push(countb);
                    countb = 0;
                } else {
                    tempw.push(countw);
                    countw =0;
                    tempb.push(countb);
                    countb =0;
                }
            }
            tempw.push(countw);
            countw =0;
            tempb.push(countb);
            countb =0;
            tempb.sort(function(a,b) {return b-a});
            tempw.sort(function(a,b) {return b-a});
            resultB[rowIndex] = tempb[0];
            resultW[rowIndex] = tempw[0];
    };
    function checkcol(colIndex, state) {
            var countb = 0;
            var countw = 0;
            var tempb = [];
            var tempw = [];
            for (var j = 0; j < 6; j ++) {
                 if (state[j][colIndex] == 'b') {
                    countb ++;
                    tempw.push(countw);
                    countw =0;
                } else if (state[j][colIndex] == 'w'){
                    countw ++;
                    tempb.push(countb);
                    countb = 0;
                } else {
                    tempw.push(countw);
                    countw =0;
                    tempb.push(countb);
                    countb =0;
                }
            }
            tempw.push(countw);
            countw =0;
            tempb.push(countb);
            countb =0;
            tempb.sort(function(a,b) {return b-a});
            tempw.sort(function(a,b) {return b-a});
            resultB[colIndex + 6] = tempb[0];
            resultW[colIndex + 6] = tempw[0];
    };
    /**
        * helper method to update the heuristic value of a diagnal line
        * @param i row index
        * @param j col index
        * @param state the 2d array of current status
        * @return the difference between b and w on this diagonal line.
        */
        function checkDiag(i, j, state) {
    //		System.out.println("Diagnose starts!!!!!!!! I " + i + " j " + j);
            var countb = 0;
            var countw = 0;
            var diagChoice = -1;
            if (i == j) {
                diagChoice = 1;
            } else if (i + j == 5) {
                diagChoice = 2;
            } else {
                return 0;
            }
            var tempb = [];
            var tempw = [];
            for (var k = 0; k < 6; k ++) {
                var l = k;
                if (diagChoice == 2) {
                    l = 5 - k;
                }
                if (state[k][l] == 'b') {
                    countb ++;
                    tempw.push(countw);
                    countw =0;
                } else if (state[k][l] == 'w'){
                    countw ++;
                    tempb.push(countb);
                    countb = 0;
                } else {
                    tempw.push(countw);
                    countw =0;
                    tempb.push(countb);
                    countb =0;
                }
            }
            tempw.push(countw);
            countw =0;
            tempb.push(countb);
            countb =0;
            tempb.sort(function(a,b) {return b-a});
            tempw.sort(function(a,b) {return b-a});
            resultB[diagChoice + 11] = tempb[0];
            resultW[diagChoice + 11] = tempw[0];
    };

};

function minimax(basic, player) {
    var temp = [];
    basic = buildPut(basic, player, 0)
};

function buildPut(input, player, depth){
            var platenum= [0,1,2,3];
            var placenum= [0,1,2,3,4,5,6,7,8,];
            var temp;
            if (depth != DEPTHLIMIT) {
                for (var i in platenum) {
                    for (var j in placenum) {
                        temp = input.clone(input); 
                        var para = document.createElement("p");
                            var node = document.createTextNode(temp);
                            para.appendChild(node);
                             var element = document.getElementById("response");
                            var child = document.getElementById("debug");
                            element.insertBefore(para,child);
                        // if (temp.place(j, i, player)) {
                        //     if (depth < DEPTHLIMIT && heuristicUpdate.getReuslt() < SCORECASES[5]/10 && heuristicUpdate.getReuslt() > -SCORECASES[5]/10) {
                        //         temp = buildRot (temp, player, depth + 1);
                        //     }
                        //     input.myChildren.push(temp);
                        // }
                    }
                }
                
            }
            
            return input;
};
        /**
        * helper method to build rotate movement
        * @param in the current board
        * @param p the player
        * @param depth current depth
    */
function buildRot(input, player, depth) {
    //		System.out.println("In buildRot");
            var platenum= [0,1,2,3];
            var rotdir = ['l','r'];
            var player = ['b', 'w'];
            var pl = player[0];
            if (player == pl) {
                pl = player[1];
            }
            
            for (var i = 0; i < platenum.length; i ++){
                for (var j = 0; j < rotdir.lenght; j ++) {
                    document.getElementById("debug").innerHTML = j;
                    var temp = input.clone();
                    if (temp.rotate(platenum[i], rotdir[j])) {
                        document.getElementById("debug").innerHTML = input.myChildren.length;
                        var  heuristicUpdate = new Heuristic(temp);
                        if (depth < DEPTHLIMIT && heuristicUpdate.getReuslt() < SCORECASES[5]/10 && heuristicUpdate.getReuslt() > -SCORECASES[5]/10) {
                            temp = buildPut (temp, pl, depth + 1);
                        }
                        input.myChildren.push(temp);
                    } else {
                        document.getElementById("debug").innerHTML = ("rotation fail");
                    }
                    
                }
                
            }
            return input;
    };

function debugOut (temp) {
    var para = document.createElement("p");
                            var node = document.createTextNode(temp);
                            para.appendChild(node);
                             var element = document.getElementById("response");
                            var child = document.getElementById("debug");
                            element.insertBefore(para,child);
};


