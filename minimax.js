/**************************************************Console part*******************************************/
    var myBasics = new basics();
    var player = 'b';
    var DEPTHLIMIT = 4;
    /**
	 * method to put the player's entrance onto the board
	 */
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
            if (myBasics.getHeuristic() > 1000000) {
                alert("b win");
                myBasics = new basics();
                player = 'b';
            } else if (myBasics.getHeuristic() < -1000000) {
                alert ("w win");
                myBasics = new basics();
            }
            pass = pass && myBasics.rotate(plater, direction);
            if (myBasics.getHeuristic() > 1000000) {
                alert("b win");
                myBasics = new basics();
                player = 'b';
            } else if (myBasics.getHeuristic() < -1000000){
                alert ("w win");
                myBasics = new basics();
            }
            document.getElementById("platestring").innerHTML = myBasics.toString();
            changePlayer();
            myBasics = myBasics.MinMax(myBasics);
            document.getElementById("platestring").innerHTML = myBasics.toString();
            changePlayer();
            document.getElementById("direction").value = "";
            document.getElementById("Plater").value = "";
            document.getElementById("Place").value = "";
            document.getElementById("Plate").value = "";
            document.getElementById("debug").innerHTML = ("player: " + player);
        }
       
	}

    /**
	 * helper method to switch player
	 */
	function changePlayer() {
		if (player == 'b') {
    		player = 'w';
    	} else {
    		player = 'b';
    	}
	}
    
    var choose = function() {
        var bw = document.getElementsByName('black-white');
            for (var i = 0; i < bw.length; i ++) {
                if (bw[i].checked) {
                    if (bw[i].nextSibling.data === "Black") {
                        player = 'b'
                    } else {
                        player = 'w';
                    }
                    var newText = "You choose the " + bw[i].nextSibling.data + " stone! Let's start the game!'";
                    document.getElementById("textContent").innerHTML = newText;
                }
            }
            document.getElementById("platestring").innerHTML =  myBasics.toString();
    };

    function basics(){
        var myPlates = createPlates();
        var stepCount = 0;
        PUTERROR = -10;
        ROTERROR = -20;
        var myHeuristic = 0;
        var myChildren = [];

        function createPlates(){
            var Plates = [];
            for (var i = 0; i < 4; i ++) {
                var rowarrray = [];
                for (var j =0; j < 3; j ++) {
                    var colarray = [];
                    for (var k =0; k < 3; k ++) {
                        colarray[k] = '_';
                    }
                    rowarrray[j] = colarray;
                }
                Plates[i] = rowarrray;
            }
            return Plates;
        };

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
                s.push('<br>');
            }
            return s.join("");;
	    };

        this.getHeuristic = function() {
            return myHeuristic;
        };
        this.getChildren = function () {
            return myChildren;
        };
        this.pushChildren = function (input) {
            myChildren.push(input);
        };
        this.setHeuristic = function(newHeuristic) {
            myHeuristic = newHeuristic;
        };

        this.setPlates = function (input) {
             for (var k = 0; k < 4; k ++) {
                for (var i = 0; i < 3; i ++) {
                    for (var j = 0; j < 3; j ++) {
                        myPlates[k][i][j] = input[k][i][j];
                    }
                }
            }
        }

        /**
        * method to put
        * @param place place to put
        * @param plate plate to put
        * @param player player char
        * @return if the move is right
        */
        this.place = function (place, plate, player) {
            var i = Math.floor(place / 3);
            var j = place % 3;
            if (myPlates[plate][i][j] === '_') {
                myPlates[plate][i][j] = player;
                stepCount ++;
                heuristicUpdate();
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
                var current = myPlates[plater];
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
                heuristicUpdate();
                return true;
            } else {
                document.getElementById("responseline").innerHTML = ("there is no such plate to rotate.");
                return false;
            }
            
        };
        this.getStepCount = function() {
		    return stepCount;
        };
        this.clone = function() {
            var re = new basics();
            re.setPlates(myPlates);
            re.stepCount = this.stepCount;
            return re;
        };
        /**
        * helper method to get the current state of the game
        * @return 2d array represent the state
        */
        var getState = function() {
            var state = [];
            for (var i = 0; i < 6; i ++) {
                state[i] = [];
                for (var j = 0; j < 6; j ++) {
                    if (j > -1 && j < 3) {
                        if (i < 3) {
                            state[i][j] = myPlates[0][i][j];
                        } else {
                            state[i][j] = myPlates[2][i-3][j];
                        }
                    } else {
                        if (i < 3) {
                            state[i][j] = myPlates[1][i][j-3];
                        } else {
                            state[i][j] = myPlates[3][i-3][j-3];
                        }
                    }
                }
            }
            return state;
        };
        var heuristicUpdate = function () {
            var rowarray = [];
            var colarray = [];
            var diagarray = [];
            var total = 0;
            //document.getElementById("debug").innerHTML = "";
            for (var i = 0; i < 6; i ++) {
                //rowarray[i] = [];
                total += checkrow(i, getState());
                //colarray[i] = [];
                total += checkcol(i, getState());
            }
            total += checkDiag(0, 0, getState());
            total += checkDiag(0, 5, getState());
            myHeuristic = total;
            //var out = document.getElementById("debug").innerHTML;
            //out += "total: " + myHeuristic;
            //document.getElementById("debug").innerHTML = out;

        };
        var checkrow = function (rowIndex, state) {
//		System.out.println("Row starts!!!!!!!! Row " + i);
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
            //var out = document.getElementById("debug").innerHTML;
            //out += ("tempb count largest " + tempb[0] + " tempw count largest " + tempw[0] + " heuristic for b " + Math.pow(10, 2*(tempb[0]-1)) + " heuristic for w: " + Math.pow(10, 2*(tempw[0]-1)) +
            //" heuristic for row :" + rowIndex + " = " + (Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1)))) + " <br>");
            //document.getElementById("debug").innerHTML = out;
            return Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1))); 
        };
        var checkcol = function (colIndex, state) {
//		System.out.println("Row starts!!!!!!!! Row " + i);
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
            //var out = document.getElementById("debug").innerHTML;
            //out += ("tempb count largest " + tempb[0] + " tempw count largest " + tempw[0] + " heuristic for b " + Math.pow(10, 2*(tempb[0]-1)) + " heuristic for w: " + Math.pow(10, 2*(tempw[0]-1)) +
            //" heuristic for col :" + colIndex + " = " + (Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1)))) + " <br>");
            //document.getElementById("debug").innerHTML = out;
            return Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1))); 
        };
        /**
        * helper method to update the heuristic value of a diagnal line
        * @param i row index
        * @param j col index
        * @param state the 2d array of current status
        * @return the difference between b and w on this diagonal line.
        */
        var checkDiag = function(i, j, state) {
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
            //var out = document.getElementById("debug").innerHTML;
        // out += ("tempb count largest " + tempb[0] + " tempw count largest " + tempw[0] + " heuristic for b " + Math.pow(10, 2*(tempb[0]-1)) + " heuristic for w: " + Math.pow(10, 2*(tempw[0]-1)) +
            // " heuristic for diag :" + diagChoice + " = " + (Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1)))) + " <br>");
        // document.getElementById("debug").innerHTML = out;
            return Math.floor(Math.pow(10, 2*(tempb[0]-1))) - Math.floor(Math.pow(10, 2*(tempw[0]-1)));
        };
        /**
        * tree size 2 levels, with one put and one rotate sublevel, so tree depth level 4, 
        * maximum node = 36 * 35 * 8 * 8  = 80640
        * @return
        */
        
        this.MinMax = function(input) {
            var currentplayer = player;
            var start = input.clone();
            buildPut(start, currentplayer, 0);
            uploadH(start, 0);
            var result = start.getHeuristic();
            //document.getElementById("debug").innerHTML = "looking for " + result;
            for (var i = 0; i < start.getChildren().length; i ++) {
                //var temp = start.getChildren()[i];
                //var out = document.getElementById("debug").innerHTML;
                //out += ("child " + i + " = " + temp.getHeuristic() + " <br>");
                //document.getElementById("debug").innerHTML = out;
                if (temp.getHeuristic() === result) {
                    if (temp.getHeuristic() > 1000000 || temp.getHeuristic() < -1000000 || temp.getStepCount() >= 36) {
                        return temp;
                    } else {
                        for (var j = 0; j < start.getChildren().length; j ++) {
                            var temp2 = temp.getChildren()[j];
                            //var out = document.getElementById("debug").innerHTML;
                            //out += (temp2 + " <br>");
                            document.getElementById("debug").innerHTML = temp.getChildren().length;
                            if (temp2.getHeuristic() === result) {
                                return temp2;
                            }
                        }
                    }
                    
                }
            }
            return null;
        };
        /**
        * helper method to build put movement
        * @param in the current board
        * @param p the player
        * @param depth current depth
        */
        var buildPut = function (input, player, depth){
            var platenum= [0,1,2,3];
            var placenum= [0,1,2,3,4,5,6,7,8,];
            if (depth != DEPTHLIMIT) {
                for (var i in platenum) {
                    for (var j in placenum) {
                        var temp = input.clone(); 
                        if (temp.place(j, i, player)) {
                            
                            input.getChildren().push(temp);
    //						temp.print();
                            if (depth < DEPTHLIMIT && temp.getHeuristic() < 1000000 && temp.getHeuristic() > -1000000) {
                                bulidRotate (temp, player, depth + 1);
                            }
                        }
                    }
                }
                
            }
        };

        /**
        * helper method to build rotate movement
        * @param in the current board
        * @param p the player
        * @param depth current depth
        */
        var bulidRotate = function(input, player, depth) {
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
                        input.getChildren().push(temp);
                        document.getElementById("debug").innerHTML = input.getChildren().length;
                        if (depth < DEPTHLIMIT && temp.getHeuristic() < 1000000 && temp.getHeuristic() > -1000000) {
                            buildPut (temp, pl, depth + 1);
                        }
                    } else {
                        document.getElementById("debug").innerHTML = ("rotation fail");
                    }
                    
                }
                
            }
        };

        /**
        * helper method to update heuristic values for all nodes
        * @param in the current board
        * @param depth current depth
        */
        var uploadH = function(input, depth) {
            //document.getElementById("debug").innerHTML = input;
            var pl = 'b';
            if ((depth/ 2) % 2 == 0) {
                pl = player;
            } else {
                if (player == 'b') {
                    pl = 'w';
                } else {
                    pl = 'b';
                }
            }
            if (!(depth == DEPTHLIMIT || input.getChildren().length === 0)) {
                for (var temp in myChildren) {
                     uploadH(temp, depth + 1);
                }
                if (pl === 'b'){
                    input.getChildren().sort(function(a,b){return b.getHeuristic() - a.getHeuristic()});
                    input.setHeuristic(input.getChildren()[0].getHeursitic());
                } else {
                    input.getChildren().sort(function(a,b){return a.getHeuristic() - b.getHeuristic()});
                    input.setHeuristic(input.getChildren()[0].getHeuristic());
                }
            } 
		
	    };
       
       
    };