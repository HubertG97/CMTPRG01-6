var express = require('express');
    mongoose = require('mongoose');


var db = mongoose.connect('mongodb://localhost/trackAPI');

var Track = require('./models/trackModel');

var app = express();

var port = process.env.PORT || 3000;

var trackRouter = express.Router();

trackRouter.route('/Tracks')
    .get(function(reg,res){
        Track.find(function(err,tracks){
           if(err)
               res.status(500).send(err);
            else
                res.json(tracks);
        });
    });

app.use('/api', trackRouter);



app.get('/', function(reg, res){
    res.send('Welcome to my API!');
});

app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);
});
