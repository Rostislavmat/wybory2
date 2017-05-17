var lvl, name = "Polska", okreg = "0", flag = 0, username = "" , pass ="";

google.charts.load("current", { packages: ["corechart", "table", "geochart"] });

function reset() {
    lvl = 0;
    name = "Polska";
    okreg = "0";
    document.getElementById("Mapa").style.visibility = "visible";
    init();
}

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
            nextStage(data2.getValue(selection[0].row, 0));
        }
    });
    chart2.draw(data2, options2);
}
function drawPieChart(data) {
    var data = new google.visualization.DataTable(data);
    var options = {
        title: 'Podzia\u0142 g\u0142os\u00F3w',
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


function drawSearch()
{
    var i;
    $("tr").remove(".search_del");
    var previousData = localStorage.getItem("search");

    if (previousData != null) {
        var result = JSON.parse(previousData);
        //var sub = result["result"];
        var table = document.getElementById("table2");
        for (i = 0; i < result.length; i++) {

            var tr = document.createElement('tr');
            var h1 = document.createElement('td');
            h1.appendChild(document.createTextNode(result[i].name));
            tr.appendChild(h1);
            var h2 = document.createElement('td');
            h2.style.visibility = "hidden";
            h2.appendChild(document.createTextNode(result[i].okreg.name));
            tr.appendChild(h2);
            var createClickHandler =
                function (row) {
                    return function () {
                        var cell = row.getElementsByTagName("td")[0];
                        var id = cell.innerHTML;
                        okreg = row.getElementsByTagName("td")[1].innerHTML;
                        lvl = 2;
                        nextStage(id);
                    };
                };

            tr.onclick = createClickHandler(tr);
            tr.classList.add("search_del");
            table.appendChild(tr);
        }
    }
    else {
        refresh();
    }


}

function Search()
{
    var form = document.getElementsByName("nazwa")[0].value;
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:8000/search/" + form + "/");
    req.addEventListener("error", function () {
        alert("Error: " + this.responseText);
        document.getElementById("status").firstChild.textContent = "offline";
    });
    req.addEventListener("load", function () {
        //displayQuestions(this.responseText);
        var data = JSON.parse(this.responseText);
        localStorage.setItem("search", this.responseText);
        localStorage.removeItem("search");
        localStorage.setItem("search", this.responseText);

        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req.send();
}
function Logout() {
    login = "";
    document.getElementById("acc").firstChild.textContent = "loser";
}

function Change() {
    if (lvl != 3) {
        alert("NOT A GMINA");
        return;
    }
    else {
        if (login == "") {
            alert("LOGIN FIRST");
            return;
        }
        else {
            var cand = document.getElementsByName("candidate")[0].value;
            var val = document.getElementsByName("new_value")[0].value;
            var req = new XMLHttpRequest();
            req.open("POST", "http://localhost:8000/change/" + name + "/" + okreg + "/" + cand + "/" + val + "/" + username + "/" + pass + "/");
            req.addEventListener("error", function () {
                alert("Error: " + this.responseText);
            });
            req.addEventListener("load", function () {
                //displayQuestions(this.responseText);
                if (this.status != 201) {
                    alert("ERROR");
                }
                else {
                    alert("CHANGE COMMITED");
                }

                //document.body.innerHTML = unicodeToChar(this.responseText);
                //localStorage.setItem("questions", this.responseText);
                //document.getElementById("status").firstChild.textContent = "online";
            });
            req.send();
        }
    }
}

function Log() {
    var login = document.getElementsByName("login")[0].value;
    var password = document.getElementsByName("password")[0].value;
    var req = new XMLHttpRequest();
    req.open("GET", "http://localhost:8000/login/" + login + "/" + password + "/");
    req.addEventListener("error", function () {
        alert("Error: " + this.responseText);
        document.getElementById("acc").firstChild.textContent = "loser";
    });
    req.addEventListener("load", function () {
        //displayQuestions(this.responseText);
        if (this.status != 201)
        {
            alert("WRONG");
            document.getElementById("acc").firstChild.textContent = "friend";
        }
        else
        {
            username = login;
            pass = password;
            document.getElementById("acc").firstChild.textContent = login;
        }

        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req.send();
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
        
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req.send();
    req_info = new XMLHttpRequest();
    req_info.open("GET", "http://localhost:8000/info/" + lvl + "/" + name + "/" + okreg + "/");
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
        
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req_info.send();
    req_pie = new XMLHttpRequest();
    req_pie.open("GET", "http://localhost:8000/pie/" + lvl + "/" + name + "/" + okreg + "/");
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
        
        //document.body.innerHTML = unicodeToChar(this.responseText);
        //localStorage.setItem("questions", this.responseText);
        //document.getElementById("status").firstChild.textContent = "online";
    });
    req_pie.send();
    if (lvl < 3) {
        req_data = new XMLHttpRequest();
        req_data.open("GET", "http://localhost:8000/data/" + lvl + "/" + name + "/" + okreg + "/");
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

            //document.body.innerHTML = unicodeToChar(this.responseText);
            //localStorage.setItem("questions", this.responseText);
            //document.getElementById("status").firstChild.textContent = "online";
        });
        req_data.send();
    }
}


function drawPie() {
    var previousPie = localStorage.getItem("pie");
    if (previousPie != null) {
        var data = JSON.parse(previousPie);
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
    if (lvl == 2) {
        okreg = x;
    }
    if (lvl != 0) 
    {
        document.getElementById("Mapa").style.visibility = "hidden";
        document.getElementById("Mapa").style.height = "0";
    }
    name = x;
}

function Update() {
    try {
        refresh();
    }
    catch (err) {
        var thehell = 1;
    }
    drawNavigation();
    drawPie();
    setstats();
    drawMap();
    drawSearch();
    setTimeout(Update, 5000);
}

function drawNavigation() {
    var i;
    $("tr").remove(".to_del");
    var previousData = localStorage.getItem("data");

    if (previousData != null) {
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
            tr.classList.add("to_del");
            table.appendChild(tr);
        }
    }
    else {
        alert("no");
        refresh();
    }
}

function setstats() {
    var previousStats = localStorage.getItem("info");
    if (previousStats != null) {
        var data = JSON.parse(previousStats);
        document.getElementById("h1").textContent = "Wybory on level " + lvl + " at " + name;
        document.getElementById("Kart").textContent = "Kart wa\u017Cnych : " + data["valid_votes"];
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
    lvl = 0;
    if (flag == 0)
    {
        flag = 1;
        Update();
    }
    
    /*document.getElementById("refresh").onclick = refresh;
    document.getElementById("ask-button").onclick = ask;
    var previousQuestions = localStorage.getItem("questions");
    if (previousQuestions != null) {
        displayQuestions(previousQuestions);
    }*/
    refresh();
}
