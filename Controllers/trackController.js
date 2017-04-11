require('mongoose-pagination');

var trackController = function(Track){

    var post = function(req, res){
        var newTrack = new Track(req.body);

        if(!req.body.title){
            res.status(400);
            res.send('Title is required');
        } else if(!req.body.artist){
            res.status(400);
            res.send('Artist is required');
        } else if(!req.body.genre){
            res.status(400);
            res.send('Genre is required');
        } else{
            newTrack.save();
            res.status(201);
            res.send(newTrack);
        }
    };



    var get = function(req, res, next){
        var page = parseInt(req.query.start) || 1;
        // Query enables the get function.
        var query = {};

        // Makes sure not all random user input is being sent to the database.
        if(req.query.client){
            query.client = req.query.client;
        }

        Track.find().exec((err, countData) => {
            if(err){
                return next(err);
            }
            var countItems = countData.length;
        var limit = parseInt(req.query.limit) || countItems;
        var tracks = {};
        var exclude = {__v: 0};

        Track.find({}, exclude)
            .paginate(page, limit)
            .exec((err, data) => {
            if(err){
                return next(err);
            } else{
                if(limit > countItems){
            limit = countItems;
        }

    }
        var totalPages = Math.ceil(countItems / limit);

        if(err){
            res.status(500).send(err);
        } else{
            if(!req.accepts('json')){
                res.status(406).send('Not Acceptable');
            } else{
                if(totalPages <= 1) {
                    newPagePrev = 1;
                    nextPagePrev = 1;
                }

                if(page <= totalPages){
                    newPageNext = page + 1;
                }

                if(page > 1){
                    newPagePrev = page - 1;
                }

                var items = tracks.items = [];
                var links = tracks._links = {};
                links.self = {};
                links.self.href = 'http://' + req.headers.host + '/api/tracks';

                var pagination = tracks.pagination = {};
                pagination.currentPage = page;
                pagination.currentItems = limit;
                pagination.totalPages = totalPages;
                pagination.totalItems = countItems;

                var paginationLinks = pagination._links = {};
                paginationLinks.first = {};
                paginationLinks.last = {};
                paginationLinks.previous = {};
                paginationLinks.next = {};

                paginationLinks.first.page = 1;
                paginationLinks.first.href = 'http://' + req.headers.host + '/api/tracks/?' + 'start=' + 1 + '&limit=' + limit;

                paginationLinks.last.page = totalPages;
                paginationLinks.last.href = 'http://' + req.headers.host + '/api/tracks/?' + 'start=' + totalPages + '&limit=' + limit;

                paginationLinks.previous.page = newPagePrev;
                paginationLinks.previous.href = 'http://' + req.headers.host + '/api/tracks/?' + 'start=' + newPagePrev + '&limit=' + limit;

                paginationLinks.next.page = newPageNext;
                paginationLinks.next.href = 'http://' + req.headers.host + '/api/tracks/?' + 'start=' + newPageNext + '&limit=' + limit;

                data.forEach(function(element, index, array){
                    var newTrack = element.toJSON();
                    var linksTracks = newProject._links = {};
                    linksTracks.self = {};
                    linksTracks.collection = {};
                    linksTracks.self.href = 'http://' + req.headers.host + '/api/tracks/' + newTrack._id;
                    linksTracks.collection.href = 'http://' + req.headers.host + '/api/tracks/';

                    items.push(newTrack);
                });
                res.json(tracks);
            }
        }
    });
    });
    };


    var getOptions = function (req, res) {
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        res.end();
    };

    var singleGet = function (req, res) {
        var returntrack = req.project.toJSON();
        returntrack._links = {};
        returntrack._links.self = {};
        returntrack._links.collection = {};
        returntrack._links.self.href = 'http://' + req.headers.host + '/api/tracks/' + req.project._id;
        returntrack._links.collection.href = 'http://' + req.headers.host + '/api/tracks/';

        res.json(returntrack);
    };

    var singlePut = function (req, res) {

        req.track.title = req.body.title;
        req.track.artist = req.body.artist;
        req.track.genre = req.body.genre;
        req.track.played = req.body.played;

        if(!req.body.title){
            res.status(400);
            res.send('title is required');
        } else if(!req.body.artist){
            res.status(400);
            res.send('artist is required');
        } else if(!req.body.genre){
            res.status(400);
            res.send('genre is required');
        } else if(!req.body.played){
            res.status(400);
            res.send('play state is required');
        } else{
            req.project.save(function(err){
                if(err){
                    res.status(500).send(err);
                } else{
                    res.json(req.track);
                }
            });
        }
    };



    var singleDelete = function (req, res) {
        req.track.remove(function(err){
            if(err){
                res.status(500).send(err);
            }
            else {
                res.status(204).send('Removed');
            }
        });
    };

    var singlePatch = function(req, res){
        if(req.body._id){
            delete req.body._id;
        }

        for(var t in req.body){
            req.track[t] = req.body[t];
        }
        req.track.save(function(err){
            if(err){
                res.status(500).send(err);
            } else{
                res.json(req.track);
            }
        });
    };

    var trackOptions = function(req, res){
        res.header('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Origin', '*');
        res.end();
    };

    return{
        post: post,
        get: get,

        getOptions: getOptions,
        singleGet: singleGet,
        singlePut: singlePut,
        singleDelete: singleDelete,
        singlePatch: singlePatch,
        trackOptions: trackOptions
    };
};

module.exports = trackController;