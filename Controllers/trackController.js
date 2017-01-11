var trackController = function(Track){

    var post = function(req, res) {
        var track = new Track(req.body);

        console.log(track);
        track.save();
        res.status(201).send(track);
    }

    var get = function(req,res){
        var query = {};

        if(req.query.genre){
            query.genre = req.query.genre;
        }
        Track.find(query, function(err,tracks){

            if(err)
                res.status(500).send(err);
            else {
                var returnTracks = [];
                tracks.forEach(function(element, index, array){
                    var newTrack = element.toJSON();
                    newTrack.links = {};
                    newTrack.links.self = 'http://' + req.headers.host + '/api/tracks/' + newTrack._id
                    returnTracks.push(newTrack)
                });
                res.json(returnTracks);

            }
        });
    }

    return{
        post: post,
        get: get
    }
}

module.exports = trackController;