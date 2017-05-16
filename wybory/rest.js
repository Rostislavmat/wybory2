var lvl,name="Polska"

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
function drawPieChart(data) {
    console.log(data);
    var data = new google.visualization.DataTable(data);
    console.log(data);
    var options = {
        title: 'Podzia³ g³osów',
        pieHole: 0.1,
        pieResidueSliceLabel: "Pozostali",
        legend: { position: 'left', maxLines: 100 },
        //chartArea : { left:20 , right : 40 } ,
        sliceVisibilityThreshold: .03
    };
    var chart = new google.visualization.PieChart(document.getElementById('pie'));
    chart.draw(data, options);
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
        localStorage.setItem("map", this.responseText);
        localStorage.removeItem("map");
        localStorage.setItem("map", this.responseText);
        drawMap();
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req.send();
    req_info = new XMLHttpRequest();
    req_info.open("GET", "http://localhost:8000/info/" + lvl + "/" + name + "/");
    req_info.addEventListener("error", function () {
        alert("Error: " + this.responseText);
        document.getElementById("status").firstChild.textContent = "offline";
    });
    req_info.addEventListener("load", function () {
        //displayQuestions(this.responseText);
        //var data = JSON.parse(this.responseText);
        localStorage.setItem("info", this.responseText);
        localStorage.removeItem("info");
        localStorage.setItem("info", this.responseText);
        setstats();
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req_info.send();
    req_pie = new XMLHttpRequest();
    req_pie.open("GET", "http://localhost:8000/pie/" + lvl + "/" + name + "/");
    req_pie.addEventListener("error", function () {
        alert("Error: " + this.responseText);
        document.getElementById("status").firstChild.textContent = "offline";
    });
    req_pie.addEventListener("load", function () {
        //displayQuestions(this.responseText);
        //var data = JSON.parse(this.responseText);
        localStorage.setItem("pie", this.responseText)
        localStorage.removeItem("pie");
        localStorage.setItem("pie", this.responseText);
        drawPie();
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req_pie.send();
    req_data = new XMLHttpRequest();
    req_data.open("GET", "http://localhost:8000/data/" + lvl + "/" + name + "/");
    req_data.addEventListener("error", function () {
        alert("Error: " + this.responseText);
        document.getElementById("status").firstChild.textContent = "offline";
    });
    req_data.addEventListener("load", function () {
        //displayQuestions(this.responseText);
        //var data = JSON.parse(this.responseText);
        localStorage.setItem("data", this.responseText);
        localStorage.removeItem("data");
        localStorage.setItem("data", this.responseText);
        drawNavigation();
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req_data.send();

}


function drawPie() {
    var previousPie = localStorage.getItem("pie");
    if (previousPie != null) {
        //alert("ok");
        var data = JSON.parse(previousPie);
        console.log(data["rows"]);
        drawPieChart(data);
    }
    else {
        alert("no");
        refresh();
    }
}

function drawMap() {
    var previousMap = localStorage.getItem("map");
    if (previousMap != null) {
        //alert("ok");
        drawChart(JSON.parse(previousMap));
    }
    else
    {
        alert("no");
        refresh();
    }
}

function nextStage(x) {
    console.log(x);
    lvl++;
    name = x;
    refresh();
    drawMap();
    drawPie();
    setstats();
    drawNavigation();
}

function drawNavigation() {
    var myNodelist = document.getElementsByTagName("tr");
    var i;
    for (i = 1; i < myNodelist.length; i++) {
        myNodelist[i].remove();
    }
    var previousData = localStorage.getItem("data");
    if (previousData != null) {
        //alert("ok");


        console.log(previousData);
        var result = JSON.parse(previousData);
        var sub = result["result"];
        var table = document.getElementById("table");
        for (i = 0; i < sub.length; i++)
        {
            
            var tr = document.createElement('tr');
            var h1 = document.createElement('td');
            h1.appendChild(document.createTextNode(sub[i].name));
            tr.appendChild(h1);
            var h2 = document.createElement('td');
            h2.classList.add("responsive_hide");
            h2.appendChild(document.createTextNode(sub[i].max_votes));
            tr.appendChild(h2);
            var h3 = document.createElement('td');
            h3.classList.add("responsive_hide");
            h3.appendChild(document.createTextNode(sub[i].valid_votes));
            tr.appendChild(h3);
            var h4 = document.createElement('td');
            h4.appendChild(document.createTextNode((sub[i].valid_votes / sub[i].max_votes * 100).toPrecision(4) + " %"));
            tr.appendChild(h4);
            var createClickHandler =
                function(row) {
                    return function() {
                        var cell = row.getElementsByTagName("td")[0];
                        var id = cell.innerHTML;
                        nextStage(id);
                        alert(lvl);
                    };
                };

            tr.onclick = createClickHandler(tr);
            table.appendChild(tr);
        }
        console.log(result["result"]);
    }
    else {
        alert("no");
        refresh();
    }
}

function setstats() {
    var previousStats = localStorage.getItem("info");
    if (previousStats != null) {
        alert("ok");
        var data = JSON.parse(previousStats);
        document.getElementById("h1").textContent = "Wybory on level " + lvl + " at " + name;
        document.getElementById("Kart").textContent = "Kart wa¿nych : " + data["valid_votes"];
        document.getElementById("Fre").textContent = "Frekwencja : " +
            (100 * data["valid_votes"] / data["max_votes"]).toPrecision(4) + "%";
        document.getElementById("Upr").textContent = "Uprawnionych : " + data["max_votes"];
        //drawChart(JSON.parse(previousMap));
    }
    else {
        alert("no");
        refresh();
    }

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
    lvl = 0

    /*document.getElementById("refresh").onclick = refresh;
    document.getElementById("ask-button").onclick = ask;
    var previousQuestions = localStorage.getItem("questions");
    if (previousQuestions != null) {
        displayQuestions(previousQuestions);
    }*/
    refresh();
    drawMap();
    drawPie();
    setstats();
    drawNavigation();
}
