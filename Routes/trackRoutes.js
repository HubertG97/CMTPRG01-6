var express = require('express');

var routes = function(Track){
    var trackRouter = express.Router();

    var trackController = require('../controllers/trackController')(Track)
    trackRouter.route('/')
        .post(trackController.post)
        .get(trackController.get);
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

            var returnTrack = req.track.toJSON();
            returnTrack.links = {};
            var newLink = 'http://' + req.headers.host + '/api/tracks/?genre=' + returnTrack.genre;
            returnTrack.links.FilterByThisGenre = newLink.replace(' ', '%20');
            res.json(returnTrack);

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
        })
        .delete(function(req, res){
            req.track.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send("Removed");
                }
            });
    });
    return trackRouter;
};

module.exports = routes;