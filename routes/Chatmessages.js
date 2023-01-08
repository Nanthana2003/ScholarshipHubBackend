const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat/Chat.js");
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config();

router.post("/chatanswer",async (req,res)=>{
    const id = req.body.id;
    const header = req.headers;
    try{
        const ver = jwt.verify(((header.token).split(" "))[1],process.env.JWT_SECRET)
            if(ver){
                console.log("success")
            }
        }
        catch(err){
            return res.status(403).json({error:"Invalid token or token not found"});
        }
    const doc = await Chat.findOne({_id:id});
    const temp = doc.answers;
    temp.push({namea:req.body.name,answer:req.body.answer});
    Chat.updateOne({"_id":id},{answers:temp}).then(()=>{
        return res.status(200).json({message:"Updated answer"});
    }).catch((err)=>{
        return res.status(400).json({error:err});
    })
})

router.post("/chatquestion",async (req,res)=>{
    const header = req.headers;
    try{
        const ver = jwt.verify(((header.token).split(" "))[1],process.env.JWT_SECRET)
            if(ver){
                console.log("success")
            }
        }
        catch(err){
            return res.status(403).json({error:"Invalid token or token not found"});
        }
    const ques = {nameq: req.body.name, question: req.body.question, answers:[]};
    Chat.insertMany([ques]).then(()=>{
        return res.status(200).json({message:"Added question"});
    }).catch((err)=>{
        return res.status(400).json({error:err});
    })

})

router.get("/chat",async (req,res)=>{
    const header = req.headers;
    try{
        const ver = jwt.verify(((header.token).split(" "))[1],process.env.JWT_SECRET)
            if(ver){
                console.log("success")
            }
        }
        catch(err){
            return res.status(403).json({error:"Invalid token or token not found"});
        }
    const result = await Chat.find();
    return res.status(200).json({message:result});

})

module.exports = router