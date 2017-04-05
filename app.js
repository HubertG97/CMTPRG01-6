var express = require('express');
    mongoose = require('mongoose');
    bodyParser =  require('body-parser');

var db = mongoose.connect('mongodb://<Heroku>:<password>@ds161518.mlab.com:61518/heroku_x2nljz03');

var Track = require('./models/trackModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

trackRouter = require('./Routes/trackRoutes')(Track);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/tracks', trackRouter);
//app.use('/api/artist', artistRouter);



app.get('/', function(req, res){
    res.send('Welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);
});
