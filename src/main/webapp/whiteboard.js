var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
canvas.addEventListener("click", defineImage, false);
document.getElementById("connect").addEventListener("click",connect, false);
document.getElementById("send").addEventListener("click",chat, false);
//var connected=false;

function connect(){
    console.log("button clicked");
    var name=document.getElementById("name").value;
    var json = JSON.stringify({
        "name":name
    });
    sendText(json);
    document.getElementById("hideIt").value=name;
    document.getElementById("connect").parentNode.removeChild(document.getElementById("connect"));
    document.getElementById("name").parentNode.removeChild(document.getElementById("name"));
}

function chat(){
    var msg=document.getElementById("chatText").value;
    document.getElementById("chatText").value="";
    if(msg.length===0) return;
    var json = JSON.stringify({
        "chat":"yes",
        "user":document.getElementById("hideIt").value,
        "msg":msg
    });
    sendText(json);
}

function getCurrentPos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function defineImage(evt) {
    var currentPos = getCurrentPos(evt);

    for (i = 0; i < document.inputForm.color.length; i++) {
        if (document.inputForm.color[i].checked) {
            var color = document.inputForm.color[i];
            break;
        }
    }

    for (i = 0; i < document.inputForm.shape.length; i++) {
        if (document.inputForm.shape[i].checked) {
            var shape = document.inputForm.shape[i];
            break;
        }
    }
    var size=document.getElementById("size");
    
    var users=document.getElementsByName("users");
    var userlist="";
    for(i=0;i<users.length;i++){
        if(users[i].checked) userlist+=users[i].value+" ";
    }
    console.log(userlist);
    
    var json = JSON.stringify({
        "users":userlist,
        "shape": shape.value,
        "color": color.value,
        "size": size.value,
        "coords": {
            "x": currentPos.x,
            "y": currentPos.y
        }
    });
    drawImageText(json);
    //if(!connected) return;
    if (document.getElementById("instant").checked) {
        sendText(json);
    }
}

function drawImageText(image) {
    console.log("drawImageText");
    var json = JSON.parse(image);
    context.fillStyle = json.color;
    switch (json.shape) {
        case "circle":
            context.beginPath();
            context.arc(json.coords.x, json.coords.y, json.size, 0, 2 * Math.PI, false);
            context.fill();
            break;
        case "square":
        default:
            context.fillRect(json.coords.x, json.coords.y, json.size, json.size);
            break;
    }
}

function defineImageBinary() {
    var image = context.getImageData(0, 0, canvas.width, canvas.height);
    var buffer = new ArrayBuffer(image.data.length);
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        bytes[i] = image.data[i];
    }
    //if(!connected) return;
    sendBinary(buffer);
}

function drawImageBinary(blob) {
    var bytes = new Uint8Array(blob);
//    console.log('drawImageBinary (bytes.length): ' + bytes.length);

    var imageData = context.createImageData(canvas.width, canvas.height);

    for (var i = 8; i < imageData.data.length; i++) {
        imageData.data[i] = bytes[i];
    }
    context.putImageData(imageData, 0, 0);

    var img = document.createElement('img');
    img.height = canvas.height;
    img.width = canvas.width;
    img.src = canvas.toDataURL();
}
