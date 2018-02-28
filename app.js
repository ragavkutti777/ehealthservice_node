var express=require("express");
var app=express();
var bodyparser=require("body-parser");

var http=require('http').Server(app);
var io=require('socket.io')(http);

var data=200;

app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);

    socket.join("room01-ehealth");

    socket.emit("notify",{'message':"Welcome to E-Health care"});

    socket.on('alert',function(data){
        io.to("room01-ehealth").emit("alert_m",{'message':"Alert triggered manually!!please go for medical checkup"});
    });
});



app.get('/',function(req,res){
    res.send("<marquee>E-health is online</marquee>");
});
app.get('/high',function(req,res){
    console.log("high");
    io.to("room01-ehealth").emit('notify',{'message':"Alert: Heartbeat is HIGH!!please go for medical checkup"});
    res.send("done");
});

app.get('/Alert',function(req,res){
    console.log("Manual Alert received");
    io.to("room01-ehealth").emit('notify',{'message':"Alert triggered manually!!please go for medical checkup"});
    res.send("done");
});

app.get('/value',function(req,res){
    console.log(req.query.storage);
    data=req.query.storage;
    io.to("room01-ehealth").emit('rk',{'message':data});
    res.send("done");
});

app.get('/low',function(req,res){
    console.log("low");
    io.to("room01-ehealth").emit('notify',{'message':"Alert: Heartbeat is LOW!!please consult with the doctor"});
    res.send("done");
});




var server=http.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

