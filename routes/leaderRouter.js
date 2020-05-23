const express =require('express');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const Leader = require('../models/leader');
const leaderRouter =express.Router();
const authenticate = require('../authenticate'); 

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    
Leader.find({})
.then((resp)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
},(err)=>next(err))
.catch((err)=>next(err));

})

.post(authenticate.verifyUser,(req, res, next) => {
  Leader.create(req.body)
  .then((resp)=>{
    console.log("Leaders Created ",resp);
     res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.put(authenticate.verifyUser,(req, res, next) => {
 res.statusCode =403;
 res.end('PUT operation not supported on /leaders');
  })
 
.delete(authenticate.verifyUser,(req, res, next) => {
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
.get((req,res,next) => {
Leader.findById(req.params.leaderId)  
.then((resp)=>{
    res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.post(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put(authenticate.verifyUser,(req, res, next) => {
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

.delete(authenticate.verifyUser, (req, res, next) => {
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