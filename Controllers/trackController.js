var trackController = function(Track){

    var post = function(req, res) {
        var track = new Track(req.body);
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

    var getOptions = function (req, res) {
        return res.json(res.get('Access-Control-Allow-Methods'))
    };

    var singleGet = function (req, res) {
        var returnTrack = req.track.toJSON();

        returnTrack.links = {};
        var newLink = 'http://' + req.headers.host + '/api/tracks/?genre=' + returnTrack.genre;
        returnTrack.links.FilterByThisGenre = newLink.replace(' ', '%20');
        res.json(returnMovie);
    };

    var singlePut = function (req, res) {
        req.track.title = req.body.title;
        req.track.artist = req.body.artist;
        req.track.genre = req.body.genre;
        req.track.played = req.body.played;
        req.track.save(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.json(req.track);
            }
        });
    };

    var singleDelete = function (req, res) {
        req.track.remove(function (err) {
            if (err)
                res.status(500).send(err);
            else {
                res.status(204).send('removed');
            }
        });
    };

    return{
        post: post,
        get: get,
        getOptions: getOptions,
        singleGet: singleGet,
        singlePut: singlePut,
        singleDelete: singleDelete
    }
}

module.exports = trackController;