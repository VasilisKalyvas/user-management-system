const router =require('express').Router()
const UserModel = require('../modules/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

/// CRUD  FROM PANEL///
//CREATE USER WITH POST

router.post('/insert', async (req,res) => {
    if(!req.body.name || !req.body.email){
        return res.send("Please enter all fields!")
    }
    if(req.body.name.length > 15){
        return res.send("Name length must be under 15 characters")
    }
    const user = await UserModel.findOne({name: req.body.name, email: req.body.email})
        if(user){
            return res.send("User already exists");
        }
    
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            const name = req.body.name
            const email = req.body.email
            const password = hash
            const role = req.body.role
           
            const user = new UserModel
             ({
                 name: name, 
                 email: email, 
                 password: password,  
                 role: role
             });
             try{
                 user.save();
                 res.send("User Created!")
                }catch(err){
                    console.log(err)
                }
            });
        });
    })
  
  // GET ALL USERS WITH GET
  
  router.get('/userlist', async (req,res) => {
     UserModel.find({}, (err,result) => {
         if(err){
             res.send(err);
         }
         res.send(result);
     })
    });
  
  // GET USER BY ID
  
  router.get('/user/:id', async (req,res) => {
      UserModel.findById(req.params.id, (err,result) => {
          if(err){
              res.send(err);
          }
          res.send(result);
      })
     });
  
  //UPDATE
  router.put('/user/:id', async (req,res) => {
           UserModel.findById(req.params.id, function (err,result){
            if(!result){
              return res.json('Unable To Find User With This Id');
            }
            else{
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
              result.name = req.body.name
              result.email = req.body.email
              result.role = req.body.role
  
               result.save().then(() => {
                  return res.json(result);
                 })
                  .catch(() => {
                      return res.status(400).send("Unable To Update ");
                  });
                });});}
      });
  });
  router.delete('/delete/:id', async (req,res) => {
      UserModel.findByIdAndDelete(req.params.id, function (err,result){
          if(!result){
             return res.json('Unable To Find User With This Id');
           }
           else{
                 return res.json('User Deleted');  
           }
        });
  });

  module.exports = router