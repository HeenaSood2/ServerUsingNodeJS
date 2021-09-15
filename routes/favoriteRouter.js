const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');
const Favorites = require('../models/Favorites');
var authenticate = require('../authenticate');
const cors = require('./cors');



const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, /*authenticate.verifyUser, */(req,res,next) => {
    Favorites.findOne({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,/* authenticate.verifyUser,*/ (req,res,next) => {
    Favorites.findOneAndDelete({user : req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions,/* authenticate.verifyUser, */(req,res,next) => {

    // check 1st whether all the dishes in the body exist in the Dishes collection
    for(var i = 0 ; i < req.body.length ; i++) { 
        var dishId = req.body[i];
        //console.log("validating dishId: "+ dishId._id);
        Dishes.findById(dishId._id)
        .then((dish) => {
            if (dish == null) {
                err = new Error('One or more of the dishes provided were not found');
                err.status = 404;
                return next(err);
            }

        }, (err) => next(err))
        .catch((err) => next(err));
    }

    // now try to add each dish to the Favorites
    for (var i = 0 ; i < req.body.length ; i++) {
            var dishId = req.body[i];
            console.log("adding dishId: " + dishId._id);
            Favorites.findOne({ user: req.user._id })
                        .then((favorites) => {
                            if (favorites == null) { 
                                Favorites.create({ user: req.user._id, dishes: [] })
                                    .then((newFavorites) => {
                                        newFavorites.dishes.push(dishId._id);
                                        console.log("saving new favorites...");
                                        newFavorites.save();
                                    }, (err) => next(err))
                            } else {
                                if (favorites.dishes.indexOf(dishId._id) == -1) {
                                    favorites.dishes.push(dishId._id);
                                    console.log("saving favorites...");
                                    favorites.save();
                                }
                            }

                        }, (err) => next(err))
                        .catch((err) => next(err));
        }

        Favorites.findOne({ user: req.user._id })
        .then((favorites) => {
            console.log("returning favorites "+ favorites);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => next(err))
        .catch((err) => next(err));

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on ${req.baseUrl}${req.path}`);
    });

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors/*, authenticate.verifyUser*/, (req, res, next) => {
       Favorites.findOne({user : req.user._id})
       .then((favorites)=>{
        if(favorites == null )
        {
            res.statusCode =200;
            res.setHeader('Content-Type','application/json');
            res.send({"exists" :false , "favorites" : favorites});
        }

        else{
            if(Favorites.dishes.indexOf(req.params.dishId) <0)
            {
                req.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.send({'exists': false , "favorites ": favorites} );

            }
            else{
                res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.send({'exists': true, "favorites": favorites});

            }

        }


       },(err)=>next(err))
       .catch((err)=>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            Favorites.findOne({user : req.user._id})
            .then((favorites)=> {                 
                if ( favorites == null ) {
                    Favorites.create({user: req.user._id, dishes: []})
                    .then((newFavorites) => {
                        newFavorites.dishes.push(req.params.dishId);
                        newFavorites.save();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(newFavorites);                        
                    }, (err) => next(err))
                } else { 
                    if ( favorites.dishes.indexOf(req.params.dishId) == -1 ) {
                        favorites.dishes.push(req.params.dishId);
                        favorites.save();
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);                    
                }

            }, (err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions,/* authenticate.verifyUser, */(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            Favorites.findOne({user : req.user._id})
            .then((favorites)=> {                 
                if ( favorites == null ) {
                    err = new Error('You did not have any favorite dish to start with');
                    err.status = 404;
                    return next(err);
                } else { 
                    if ( favorites.dishes.indexOf(req.params.dishId) == -1 ) {
                        err = new Error('The dish you chose to delete : ' + req.params.dishId + 'was not among your favorites');
                        err.status = 404;
                        return next(err);

                    } else {
                        favorites.dishes = favorites.dishes.filter((id) => ! id.equals(req.params.dishId));
                        if ( favorites.dishes.length == 0 ) {
                            favorites.remove() // if after removing the dish none remains then remove the document
                            res.json(null);
                        }
                        else {
                            favorites.save();
                            res.json(favorites);   
                        }
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                    }                
                }

            }, (err) => next(err))
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on ${req.baseUrl}${req.path}`);
});

module.exports = favoriteRouter;