/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var wsUri = "ws://" + document.location.host + document.location.pathname + "endpoint";
var websocket = new WebSocket(wsUri);
websocket.binaryType = "arraybuffer";

websocket.onerror = function(evt) { onError(evt) };

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

// For testing purposes
/*
var output = document.getElementById("output");
websocket.onopen = function(evt) { onOpen(evt) };

function writeToScreen(message) {
    output.innerHTML += message + "<br>";
}

function onOpen() {
    writeToScreen("Connected to " + wsUri);
}*/
// End test functions

websocket.onmessage = function(evt) { onMessage(evt) };

function sendText(json) {//from click on canvas
    console.log("sending text: " + json);
    websocket.send(json);
}

function onMessage(evt) {
    console.log("received: " + evt.data);
    if (typeof evt.data === "string") {
        if(evt.data[0]=='l'){///listing existing users
            str=evt.data;
            temp="";
            for(i=1;i<str.length;i++){
                if(str[i]==' '){
                    temp="<input type=\"checkbox\" name=\"users\" value=\""+temp+"\">"+temp+"<br>";
                    document.getElementById("userList").insertAdjacentHTML('beforeend', temp);
                    temp="";
                }
                else temp+=str[i];
            }
        }
        else if(evt.data[2]=='n') {///{"name":"aysha"}///listing the newly entered user
            var json = JSON.parse(evt.data);
            var str=json.name;
            str="<input type=\"checkbox\" name=\"users\" value=\""+str+"\">"+str+"<br>";
            document.getElementById("userList").insertAdjacentHTML('beforeend', str);
            console.log("Name recieved "+str);
        }
        else if(evt.data[2]=='c'){
            var json = JSON.parse(evt.data);
            var msg="<strong>"+json.user+" :</strong>"+json.msg+"<br/>";
            document.getElementById("chat").insertAdjacentHTML('beforeend', msg);
        }
        else {
            var json = JSON.parse(evt.data);
            var str=json.users;
            var yes=0;
            var temp="";
            var myName=document.getElementById("hideIt").value;
            for(i=0;i<str.length;i++){
                if(str[i]==" "){
                    if(temp==myName){ yes=1; break; }
                    temp="";
                }
                else temp+=str[i];
            }
            if(yes==1) drawImageText(evt.data);
        }
    } else {
        drawImageBinary(evt.data);
    }
}

function sendBinary(bytes) {
    console.log("sending binary: " + Object.prototype.toString.call(bytes));
    websocket.send(bytes);
}