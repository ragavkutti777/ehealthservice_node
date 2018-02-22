var express=require("express");
var app=express();
var bodyparser=require("body-parser");

var http=require('http').Server(app);
var io=require('socket.io')(http);

var data=0;

function notify(req,res,next)
{
    console.log("request been made"+req.url);
    next();
}

app.use(notify);
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);

    socket.join("room01-ehealth");

    socket.emit("notify",{'message':"Welcome to E-Health care"});

});


app.get('/',function(req,res){
    res.send("<marquee>E-health is online</marquee>");
});
app.get('/high',function(req,res){
    console.log("high");
    io.to("room01-ehealth").emit('notify',{'message':"Heartbeat is HIGH"});
    res.send("done");
});

app.get('/low',function(req,res){
    console.log("low");
    io.to("room01-ehealth").emit('notify',{'message':"Heartbeat is LOW"});
    res.send("done");
});

app.post("/datum",function(req,res){
    var d={
        result:[{
            storage:data
        }]
    };
    res.send(JSON.stringify(d));
});


var server=http.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

