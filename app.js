var express=require("express");
var app=express();
var bodyparser=require("body-parser");

var http=require('http').Server(app);
var io=require('socket.io')(http);

app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);

    socket.join("room01-ehealthservice");

    socket.emit("notify",{'message':"Welcome to E-Health service"});

});

app.get('/high',function(req,res){
    console.log("high");
    io.to("room01-ehealthservice").emit('notify',{'message':"Alert"});
    res.send("done");
});

var server=http.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});