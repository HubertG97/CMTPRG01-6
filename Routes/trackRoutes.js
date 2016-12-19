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
    trackRouter.use('/:trackId', function(req, res, next){
        Track.findById(req.params.trackId, function(err,track){
            if(err)
                res.status(500).send(err);
            else if (track)
            {
                req.track = track;
                next();
            }
            else
            {
                res.status(404).send('No Track Found');
            }
        });
    })
    trackRouter.route('/:trackId')
        .get(function(req,res){
            /*var query = {};

            if(req.query.genre){
                query.genre = req.query.genre;
            }*/
            res.json(req.track);

        })
        .put(function(req, res){
            req.track.title = req.body.title;
            req.track.artist = req.body.artist;
            req.track.genre = req.body.genre;
            req.track.played = req.body.played;
            req.track.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                {
                    res.json(req.track);
                }
            });
            res.json(req.track);
    })
        .patch(function(req, res){
            if(req.body._id)
                delete req.body._id;
            
            for(var p in req.body)
            {
                req.track[p] = req.body[p];
            }

            req.track.save(function(err){
                if(err)
                    res.status(500).send(err);
                else
                {
                    res.json(req.track);
                }
            });
        });
    return trackRouter;
};

module.exports = routes;