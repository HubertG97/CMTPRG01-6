var trackController = function(Track){

    var post = function(req, res) {
        var track = new Track(req.body);
        track.save();
        res.status(201).send(track);
    }



    var get = function(req,res){
        var query = {};
        var result = {};

        if(req.query.genre){
            query.genre = req.query.genre;
        }
        Track.find(query, '-__v').exec(function (err, tracks) {

            if (err)
                res.status(500).send(err);
            else
                var trackArray = [];
            result.items = trackArray;
            result._links = {
                self: {
                    href: 'http://' + req.headers.host + '/api/tracks/'
                }
            };
            result.pagination = {
                "pagination": {
                    "currentPage": 1,
                    "currentItems": 6,
                    "totalPages": 1,
                    "totalItems": 6,
                    "_links": {
                        "first": {
                            "page": 1,
                            "href": 'http://' + req.headers.host + '/api/tracks/'
                        },
                        "last": {
                            "page": 1,
                            "href": 'http://' + req.headers.host + '/api/tracks/'
                        },

                        "previous": {
                            "page": 1,
                            "href": 'http://' + req.headers.host + '/api/tracks/'
                        },
                        "next": {
                            "page": 1,
                            "href": 'http://' + req.headers.host + '/api/tracks/'
                        }
                    }
                }
            };


            tracks.forEach(function (element) {
                var newTrack = element.toJSON();
                newTrack._links = {};
                newTrack._links.self = {

                    href: 'http://' + req.headers.host + '/api/tracks/' + newTrack._id
                };
                newTrack._links.collection = {

                    href: 'http://' + req.headers.host + '/api/tracks'
                };

                newTrack._links.collection.href =  newTrack._links.collection.href.replace(/ /g, '%20');

                trackArray.push(newTrack);
            });

            res.json(result);
        });
    };



    var getOptions = function (req, res) {
        return res.json(res.get('Access-Control-Allow-Methods'))
    };

    var singleGet = function (req, res) {
        var returnTrack = req.track.toJSON();

        returnTrack.links = {};
        var newLink = 'http://' + req.headers.host + '/api/tracks/?genre=' + returnTrack.genre;
        returnTrack.links.FilterByThisGenre = newLink.replace(/ /g, '%20');
        res.json(returnTrack);
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
                res.status(204).send('Deleted');
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
};

module.exports = trackController;