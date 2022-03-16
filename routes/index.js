var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')



router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      wishes: [],
    })
  
    saveUser = await newUser.save()
       
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.post('/addWishes', async function(req,res,next){

var shortToken = req.body.tokenFromFront
var wishesUser = await userModel.findOne({token : shortToken}) 

var wishes = {source: req.body.source, title : req.body.title, image: req.body.image ,content: req.body.content}
wishesUser.wishes.push(wishes)
var UpdateWishes = wishesUser.save()

  res.json({UpdateWishes})

})

router.delete('/deleteWishes', async function(req,res,next){
  var shortToken = req.body.tokenFromFront
  var wishesUser = await userModel.findOne({token : shortToken})
  var wishesList = wishesUser.wishes.findIndex((element) => element.title == req.body.title)
 
    wishesUser.wishes.splice(wishesList,1);
  
  var wishesUserSave = wishesUser.save()
  res.json(wishesUserSave)
})

router.get('/getWishes/:token', async function(req,res,next){
  var shortToken = req.params.token
  var wishesUser = await userModel.findOne({token : shortToken})
  var wishes = wishesUser.wishes
  res.json(wishes)
})

module.exports = router;
