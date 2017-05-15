function displayQuestions(jsonQuestions) {
    var data = JSON.parse(jsonQuestions);

    var questions = document.getElementById("questions");

    while (questions.firstChild) {
        questions.removeChild(questions.firstChild);
    }

    for (var ix in data) {
        var li = questions.appendChild(document.createElement("li"));

        li.appendChild(document.createTextNode(data[ix]["question"] + " "));

        var delLink = li.appendChild(document.createElement("a"));
        delLink.appendChild(document.createTextNode("[x]"));
        delLink.questionId = data[ix]["pk"];
        delLink.onclick = function() {
            var req = new XMLHttpRequest();
            req.open("DELETE", "http://localhost:8000/rest/delete/" + this.questionId + "/");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            req.addEventListener("error", function() {
                alert("Error: " + this.responseText);
            });
            req.addEventListener("load", function() {
                alert("OK");
            });
            req.send();
        };
    }
}

google.charts.load("current", { packages: ["corechart", "table", "geochart"] });
function drawChart(data) {
    var data2 = new google.visualization.DataTable(data);
    var options2 = {
        region: 'PL',
        resolution: 'provinces',
        datalessRegionColor: 'transparent',
        colorAxis: { colors: ['#c3c90a', '#d65906', '#8c0106'] },
    };

    var chart2 = new google.visualization.GeoChart(document.getElementById('Mapa'));
    google.visualization.events.addListener(chart2, 'select', function () {
        var selection = chart2.getSelection();
        if (selection.length > 0) {
            window.open('./woje/' + data2.getValue(selection[0].row, 0), "_self");
        }
    });
    chart2.draw(data2, options2);
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}
function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi,
        function (match) {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
}
function refresh() {
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:8000/map/");
    req.addEventListener("error", function() {
        alert("Error: " + this.responseText);
        document.getElementById("status").firstChild.textContent = "offline";
    });
    req.addEventListener("load", function() {
        //displayQuestions(this.responseText);
        var data = JSON.parse(this.responseText);
        drawChart(data);
        localStorage.setItem("map", data);
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req.send();
}



function ask() {
    var req = new XMLHttpRequest();
    req.open("POST", "http://localhost:8000/rest/post/");
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.addEventListener("error", function () {
        alert("Error: " + this.responseText);
    });
    req.addEventListener("load", function () {
        alert("OK");
    });
    var question = document.getElementById("question").value;
    req.send("question=" + encodeURIComponent(question));
}


function init() {
    /*document.getElementById("refresh").onclick = refresh;
    document.getElementById("ask-button").onclick = ask;
    var previousQuestions = localStorage.getItem("questions");
    if (previousQuestions != null) {
        displayQuestions(previousQuestions);
    }*/
    refresh();
    
}