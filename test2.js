function choose () {
    document.getElementById("showing text").innerHTML = "THIS IS THE START";
    setInterval(function() {document.getElementById("showing text").innerHTML = "THIS IS THE second";}, 2000);
    setInterval(function() {document.getElementById("showing text").innerHTML = "THIS IS THE second";}, 2000);
}
