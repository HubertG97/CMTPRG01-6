var express = require('express');

var routes = function(Track){
    var trackRouter = express.Router();
    var trackController = require('../Controllers/trackController')(Track);

    trackRouter.route('/')
        .post(trackController.post)
        .get(trackController.get)
        .options(trackController.getOptions);

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
    });
    trackRouter.route('/:trackId')
        .get(trackController.singleGet)
        .put(trackController.singlePut)
        .delete(trackController.singleDelete)
        .patch(trackController.singlePatch)
        .options(trackController.trackOptions);

    return trackRouter;
};

module.exports = routes;