function clicked() {

	var user = document.getElementById('username').value;
	var pass = document.getElementById('password').value;

	var str = "email="+user+"&pwd="+pass;
	ajaxFunction(str);

}
function registration () {
	window.open('registration.html','_self',false);
}
//Browser Support Code
function ajaxFunction(str) {
    var xmlhttp = new XMLHttpRequest();;
    if (str.length == 0) {
        alert("no input");
        return;
    }
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {  // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(this.responseText);
            if(result.result == "success") {
                window.open("PentagoPage.html",'_self',false);
            } else {
                alert(result.error);
                document.getElementById('username').innerHTML = "";
                document.getElementById('password').innerHTML = "";
            }
        }
    }
    var link = "http://cssgate.insttech.washington.edu/~yyang3/pentagojs/login.php?"+ str;
    xmlhttp.open("GET", link, true);
    xmlhttp.send();    
}