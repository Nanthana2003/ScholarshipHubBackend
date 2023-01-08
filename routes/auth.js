const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/User/User.js")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();

router.post("/login",(req,res,next)=>{
    
    try{
    passport.authenticate("local",function(err,user,info){
        if(err){
            return res.status(400).json({error:err.messaage});
        }
    
        if(info!=null && (info.message == "Incorrect password"|| info.message == "User not found")){
            return res.status(400).json({message:info.message});
        }
        req.logIn(user,function(err){
            console.log(user)
            if(err){
                return res.status(400).json({error:err})
            }
            jwt.sign({user:user},process.env.JWT_SECRET,{expiresIn:"1h"},(err,token)=>{
                if(err){
                    return res.status(400).json({message:"Failed to login",token:null});
                }
                return res.status(200).json({message:"logged in successfully",token:token,username:user.username,email:user.email,id:user._id})
            })
            
        })
    })(req,res,next);
}
catch(err){
    return res.status(400).json({error:err});
}
})

router.post("/register",async (req,res)=>{
    const user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"User already exists"})
    }
    else{
        bcrypt.genSalt(10,(err,salt)=>{
            
            bcrypt.hash(req.body.password,salt,(err,hash)=>{
                if(err){
                    return console.log(err);
                }
                const newUser = {username:req.body.username, email:req.body.email, password:hash}
                User.insertMany([newUser]).then(()=>{
                    return res.status(200).json({message:"Added successfully"});
                }).catch((err)=>{
                    return res.status(400).json({error:err});
                })
            })
        })
        
    }
})

router.get("/userdetails",async (req,res)=>{
    const id = req.body.id;
    const user = await User.findOne({"_id":id});
    return res.status(200).json({message:user});
})

module.exports = router;