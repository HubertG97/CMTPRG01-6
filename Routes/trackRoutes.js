var express = require('express');

var routes = function(Track){
    var trackRouter = express.Router();

    trackRouter.route('/')
        .post(function(req, res){
            var track = new Track(req.body);

            console.log(track);
            track.save();
            res.status(201).send(track);
        })
        .get(function(req,res){
            var query = {};

            if(req.query.genre){
                query.genre = req.query.genre;
            }
            Track.find(query, function(err,tracks){

                if(err)
                    res.status(500).send(err);
                else
                    res.json(tracks);
            });
        });

    trackRouter.route('/Tracks/:trackId')

        .get(function(req,res){
            var query = {};

            if(req.query.genre){
                query.genre = req.query.genre;
            }
            Track.findById(req.params.trackId, function(err,track){
                if(err)
                    res.status(500).send(err);
                else
                    res.json(track);
            });
        });
    return trackRouter;
};

module.exports = routes;