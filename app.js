var express = require('express');
    mongoose = require('mongoose');
    bodyParser =  require('body-parser');

var db = mongoose.connect('mongodb://localhost/trackAPI');

var Track = require('./models/trackModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

trackRouter = require('./Routes/trackRoutes')(Track);

app.use('/api/tracks', trackRouter);
//app.use('/api/artist', artistRouter);



app.get('/', function(req, res){
    res.send('Welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);
});
