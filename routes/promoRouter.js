const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promo = require('../models/promo');
const authenticate =require('../authenticate');
const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')

.get((req,res,next) => {
    
Promo.find({})
.then((resp)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
},(err)=>next(err))
.catch((err)=>next(err));

})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  Promo.create(req.body)
  .then((resp)=>{
    console.log("Promotion Created ",resp);
     res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
 res.statusCode =403;
 res.end('PUT operation not supported on /promotions');
  })
 
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Promo.remove({})
    .then((resp)=>{
        res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
    },(err)=>next(err))
.catch((err)=>next(err));
});


//promotions/:promoId
 promoRouter.route('/:promoId')
.get((req,res,next) => {
Promo.findById(req.params.promoId)  
.then((promo)=>{
    res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(promo);
 },(err)=>next(err))
.catch((err)=>next(err));

})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
Promo.findByIdAndUpdate(req.params.promoId,{
  $set :req.body
 },{new :true})
 .then((promo)=>{
  res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(promo);
 },(err)=>next(err))
.catch((err)=>next(err));
})

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
   Dishes.findByIdAndRemove(req.params.promoId)
.then((resp)=>{
        res.statusCode=200;
  res.setHeader('Content-Type','application/json');
  res.json(resp);
    },(err)=>next(err))
.catch((err)=>next(err));
});



//exporting promoRouter
module.exports=promoRouter;