const express =require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const Leader = require('../models/leader');
const leaderRouter =express.Router();
const authenticate = require('../authenticate'); 
const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
    
Leader.find({})
.then((resp)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
},(err)=>next(err))
.catch((err)=>next(err));

})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Leader.create(req.body)
  .then((resp)=>{
    console.log("Leaders Created ",resp);
     res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
 res.statusCode =403;
 res.end('PUT operation not supported on /leaders');
  })
 
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leader.remove({})
    .then((resp)=>{
        res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
    },(err)=>next(err))
.catch((err)=>next(err));
});



//leaders/:leaderId
 leaderRouter.route('/:leaderId')
 .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,(req,res,next) => {
Leader.findById(req.params.leaderId)  
.then((resp)=>{
    res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
Leader.findByIdAndUpdate(req.params.leaderId,{
  $set :req.body
 },{new :true})
 .then((resp)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));
})

.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, (req, res, next) => {
   Leader.findByIdAndRemove(req.params.leaderId)
.then((resp)=>{
        res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
    },(err)=>next(err))
.catch((err)=>next(err));
});


//Exporting leaderRouter
module.exports=leaderRouter;